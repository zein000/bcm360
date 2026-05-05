/**
 * Klasse: CourseProgressGateway
 *
 * Diese Klasse stellt ein WebSocket-Gateway dar, das für das Senden und Empfangen
 * von Nachrichten im Zusammenhang mit dem Fortschritt eines Kurses zuständig ist.
 *
 * Sie verwendet das NestJS WebSocket-Modul und sendet regelmäßig Updates
 * über den Fortschritt aktiver Szenarien. Außerdem behandelt sie Timer-bezogene Logik
 * (z.B. Ablauf von Zeitabschnitten) und ermöglicht die Kommunikation mit Clients über Socket.IO.
 *
 * Hauptfunktionen:
 * - Initialisierung und Zerstörung eines regelmäßigen Timers
 * - Senden von Events an bestimmte Clients oder alle über WebSocket
 * - Interaktion mit dem Cache und anderen Services zur Verwaltung von Fortschritten
 */

import {forwardRef, Inject, Injectable, Logger, UseGuards} from "@nestjs/common";
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {WebSocketGuard} from "src/auth/guards/web-socket.guard";
import {ScenarioProgress} from "src/caching/interfaces/ScenarioProgress.interface";
import {ScenarioProgressCachingService} from "src/caching/services/scenario-progress-caching.service";
import {PermissionCodes} from "src/permissions/enum/codes";
import {v4} from "uuid";
import {CourseProgressService} from "./course-progress.service";
import {AdditionalStatusInfoTags} from "./enum/AdditionalStatusInfoTags.enum";
import {ScenarioActionTypes} from "./enum/ScenarioActionTypes.enum";
import {ScenarioMessageTypes} from "./enum/ScenarioMessageTypes.enum";
import {ServiceMessageType} from "./enum/ServiceMessageType.enum";
import {SocketEvents} from "./enum/SocketEvents.enum";
import {CourseProgressEnum} from "./enum/Status";
import {ScenarioMessageInfo} from "./interfaces/ScenarioMessageInfo.interface";

@ApiTags("Scenario Progress WebSocket")
@Injectable()
@WebSocketGateway({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    transports: ["polling", "websocket"],
})
export class CourseProgressGateway {
    private readonly logger = new Logger(CourseProgressGateway.name);
    private stageEndTimers: NodeJS.Timeout;

    @WebSocketServer()
    private server: Server;

    constructor(
        @Inject(forwardRef(() => CourseProgressService))
        private readonly courseProgressService: CourseProgressService,
        private readonly scenarioProgressCachingService: ScenarioProgressCachingService
    ) {
    }

    /**
     * Funktion: onModuleInit
     *
     * Wird beim Initialisieren des Moduls aufgerufen.
     * Startet einen Intervall-Timer, der jede Sekunde zwei Methoden ausführt:
     * - `checkACtiveScenariosTimeBasedContent`: prüft zeitbasierte Inhalte aktiver Szenarien
     * - `checkActiveScenariosTimers`: prüft laufende Timer innerhalb aktiver Szenarien
     */
    onModuleInit() {
        this.stageEndTimers = setInterval(async () => {
            await this.checkACtiveScenariosTimeBasedContent();
            await this.checkActiveScenariosTimers();
        }, 1000);
    }

    /**
     * Funktion: onModuleDestroy
     *
     * Wird beim Zerstören (Beenden) des Moduls aufgerufen.
     * Stoppt den laufenden Timer, um Speicherlecks oder unnötige Prozesse zu vermeiden.
     */
    onModuleDestroy() {
        if (this.stageEndTimers) {
            clearInterval(this.stageEndTimers);
        }
    }

    /**
     * Funktion: emitSocketEvent
     *
     * Sendet ein Socket-Event an einen bestimmten Raum (`courseProgressId`) oder an alle Clients.
     * Je nach übergebenem Datensatz (`data`) wird das Event mit oder ohne Payload gesendet.
     *
     * @param courseProgressId - ID des Kursfortschritts (Raumname im Socket.IO-Kontext)
     * @param action - Der Event-Typ (z.B. `SocketEvents.STAGE_STARTED`)
     * @param data - Die zu sendenden Daten (optional)
     *
     * Beispiel:
     * emitSocketEvent("abc123", SocketEvents.STAGE_ENDED, { status: "complete" })
     */
    emitSocketEvent(courseProgressId: string | null | undefined, action: SocketEvents, data: any) {
        if (typeof courseProgressId === "string" && courseProgressId.trim()) {
            if (data) {
                return this.server.to(courseProgressId).emit(action, data);
            } else {
                return this.server.to(courseProgressId).emit(action);
            }
        }
        return this.server.emit(action);
    }

    /**
     * Funktion: handleConnection
     *
     * Wird ausgelöst, wenn ein neuer Client eine Verbindung zum WebSocket-Gateway herstellt.
     * Protokolliert Verbindungsinformationen und registriert einen Listener für das Trennungsereignis.
     *
     * @param client - Das verbundene Socket.IO-Client-Objekt
     */
    async handleConnection(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        this.logger.log(`Headers: ${JSON.stringify(client.handshake.headers)}`);
        this.logger.log(`Client Query: ${JSON.stringify(client.handshake.query)}`);

        client.on("disconnect", (reason) => {
            this.logger.log(`Client Disconnected. ID: ${client.id}, Reason: ${reason}`);
        });
    }

    /**
     * Funktion: handleJoinRoom
     *
     * Ermöglicht einem Client, einem bestimmten WebSocket-Raum beizutreten, basierend auf einer übergebenen `courseId`.
     * Aktualisiert außerdem die Liste der verbundenen Nutzer in diesem Raum und sendet sie an alle Teilnehmer.
     *
     * @param courseId - Die ID des Kurses (gleichzeitig Raumname im Socket.IO-System)
     * @param client - Das Socket-Objekt des Clients
     *
     * Voraussetzungen: Der WebSocketGuard muss den Zugriff autorisieren.
     */
    @ApiOperation({summary: "Join a WebSocket room"})
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                courseId: {type: "string"},
            },
        },
    })
    @ApiResponse({status: 200, description: "Joined room successfully"})
    @ApiResponse({status: 400, description: "Course ID is required"})
    @UseGuards(WebSocketGuard)
    @SubscribeMessage(SocketEvents.JOIN_ROOM)
    async handleJoinRoom(@MessageBody() courseId: string, @ConnectedSocket() client: Socket) {
        if (!courseId) {
            client.emit(SocketEvents.ERROR, "Course ID is required");
            this.logger.error(`SOCKET EVENT:${SocketEvents.JOIN_ROOM} - Course ID is required`);
            return;
        }

        client.join(courseId);
        client["courseId"] = courseId;

        const user = client["user"];
        if (user?.id) {
            await this.scenarioProgressCachingService.updateUserExitTimeStamp(courseId, user, null);
        }

        const connectedUsers = await this.getConnectedUsersInRoom(courseId);
        client.to(courseId).emit(SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
        client.emit(SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
    }

    /**
     * Funktion: handleDisconnect
     *
     * Wird aufgerufen, wenn ein Client die Verbindung trennt.
     * Aktualisiert den Ausstiegszeitpunkt des Benutzers im Cache
     * und informiert verbleibende Teilnehmer im Raum über die neuen Verbindungsdaten.
     *
     * @param client - Das Socket-Objekt des getrennten Clients
     */
    @ApiOperation({summary: "Handle WebSocket disconnection"})
    @UseGuards(WebSocketGuard)
    async handleDisconnect(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const user = client["user"];
        const courseProgressId = client["courseId"];

        if (user?.id) {
            await this.scenarioProgressCachingService.updateUserExitTimeStamp(courseProgressId, user);
        }

        const connectedUsers = await this.getConnectedUsersInRoom(courseProgressId);
        client.to(courseProgressId).emit(SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
    }

    /**
     * Funktion: handleChatMessage
     *
     * Behandelt eingehende Chatnachrichten eines Clients und speichert diese im Cache.
     * Sendet die Nachricht anschließend an alle anderen Clients im gleichen Kursraum.
     *
     * @param data - Objekt mit Nachrichtentext und Kurs-ID
     * @param client - Der Client, der die Nachricht sendet
     *
     * Voraussetzungen: Der WebSocketGuard muss den Zugriff autorisieren.
     *
     * Beispiel:
     * {
     *   message: "Hallo zusammen!",
     *   courseId: "abc123"
     * }
     */
    @ApiOperation({summary: "Send a chat message"})
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                message: {type: "string"},
                courseId: {type: "string"},
            },
        },
    })
    @ApiResponse({status: 200, description: "Message sent successfully"})
    @ApiResponse({status: 400, description: "Message and courseId are required"})
    @UseGuards(WebSocketGuard)
    @SubscribeMessage(SocketEvents.SEND_CHAT)
    async handleChatMessage(
        @MessageBody() data: { message: string; courseId: string },
        @ConnectedSocket() client: Socket
    ) {
        if (!data?.message || !data?.courseId) {
            client.emit(SocketEvents.ERROR, "Message and courseId are required");
            this.logger.error(
                `SOCKET EVENT:${SocketEvents.SEND_CHAT} - Message and courseId are required`
            );
            return;
        }

        const user = client["user"];

        const messageBody: ScenarioMessageInfo = {
            id: v4(),
            data: {
                userId: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                message: data.message,
            },
            type: ScenarioMessageTypes.MESSAGE,
            timestamp: Date.now(),
        };

        await this.scenarioProgressCachingService.saveChatMessage(data.courseId, messageBody);

        client.to(data.courseId).emit(SocketEvents.CHAT, messageBody);
        client.emit(SocketEvents.CHAT, messageBody);
    }

    /**
     * Funktion: handleProtocolMessage
     *
     * Behandelt das Senden von Protokollnachrichten (Chatnachricht oder Entscheidungsoptionen)
     * durch einen verbundenen WebSocket-Client. Validiert den Input, erstellt ein standardisiertes
     * Nachrichtenobjekt und sendet dieses an alle Teilnehmer im Kursraum.
     *
     * Unterstützte Nachrichtentypen:
     * - MESSAGE: einfache Textnachricht mit Benutzerinformationen
     * - DECISION: strukturierte Entscheidungsoptionen (z. B. Mehrfachauswahl mit Bestätigung)
     *
     * @param type - Typ der Nachricht (MESSAGE oder DECISION)
     * @param data - Inhalt der Nachricht (je nach Typ unterschiedlich strukturiert)
     * @param courseId - Raum/Kurs, in dem die Nachricht veröffentlicht wird
     * @param client - Das Socket.IO-Client-Objekt
     */
    @ApiOperation({summary: "Send a protocol message"})
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                type: {type: typeof ScenarioMessageTypes},
                data: {type: "any"},
                courseId: {type: "string"},
            },
        },
    })
    @UseGuards(WebSocketGuard)
    @SubscribeMessage(SocketEvents.SEND_PROTOCOL)
    async handleProtocolMessage(
        @MessageBody()
        {type, data, courseId}: { type: ScenarioMessageTypes; data: any; courseId: string },
        @ConnectedSocket() client: Socket
    ) {
        if (!data || !courseId || !type) {
            client.emit(SocketEvents.ERROR, "Data, course id and type are required");
            this.logger.error(
                `SOCKET EVENT:${SocketEvents.SEND_PROTOCOL} - Data, course id and type are required`
            );
            return;
        }

        const user = client["user"];
        let protocolMessageData: ScenarioMessageInfo;

        if (type === ScenarioMessageTypes.MESSAGE) {
            if (!data?.message) {
                client.emit(SocketEvents.ERROR, "Message is required");
                this.logger.error(`SOCKET EVENT:${SocketEvents.SEND_PROTOCOL} - Message is required`);
                return;
            }

            protocolMessageData = {
                id: v4(),
                data: {
                    userId: user?.id,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                    message: data?.message,
                },
                type: ScenarioMessageTypes.MESSAGE,
                timestamp: Date.now(),
            };
        } else if (type === ScenarioMessageTypes.DECISION) {
            if (!data?.confirmationRequired || !data?.decisionOptions?.length) {
                client.emit(SocketEvents.ERROR, "Name, confirmation type and options are required");
                this.logger.error(
                    `SOCKET EVENT:${SocketEvents.SEND_PROTOCOL} - Name, confirmation type and options are required`
                );
                return;
            }

            protocolMessageData = {
                id: v4(),
                data,
                type: ScenarioMessageTypes.DECISION,
                timestamp: Date.now(),
            };
        }

        await this.scenarioProgressCachingService.saveProtocolMessage(courseId, protocolMessageData);
        client.to(courseId).emit(SocketEvents.PROTOCOL, protocolMessageData);
        client.emit(SocketEvents.PROTOCOL, protocolMessageData);
    }

    /**
     * Funktion: handleUpdateProtocolMessage
     *
     * Dient zum Aktualisieren bereits existierender Protokollnachrichten. Dies kann notwendig sein,
     * um Inhalte nachträglich zu korrigieren oder Entscheidungsoptionen zu aktualisieren.
     *
     * Es wird die `messageId` verwendet, um die ursprüngliche Nachricht zu identifizieren.
     * Die aktualisierte Nachricht wird anschließend im Cache gespeichert und an alle Teilnehmer im Kursraum gesendet.
     *
     * @param messageId - Die ID der zu aktualisierenden Nachricht
     * @param type - Nachrichtentyp (MESSAGE oder DECISION)
     * @param data - Neue Daten für die Nachricht
     * @param courseId - Kurs-/Raum-ID
     * @param client - Der sendende WebSocket-Client
     */
    @ApiOperation({summary: "Update a protocol message"})
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                type: {type: typeof ScenarioMessageTypes},
                data: {type: "any"},
                courseId: {type: "string"},
                messageId: {type: "string"},
            },
        },
    })
    @UseGuards(WebSocketGuard)
    @SubscribeMessage(SocketEvents.UPDATE_PROTOCOL)
    async handleUpdateProtocolMessage(
        @MessageBody()
        {
            messageId,
            type,
            data,
            courseId,
        }: { messageId: string; type: ScenarioMessageTypes; data: any; courseId: string },
        @ConnectedSocket() client: Socket
    ) {
        if (!data || !courseId || !type || !messageId) {
            client.emit(SocketEvents.ERROR, "Message id, data, course id and type are required");
            this.logger.error(
                `SOCKET EVENT:${SocketEvents.UPDATE_PROTOCOL} - Message id, data, course id and type are required`
            );
            return;
        }

        const user = client["user"];
        let protocolMessageData: ScenarioMessageInfo;

        if (type === ScenarioMessageTypes.MESSAGE) {
            if (!data?.message) {
                client.emit(SocketEvents.ERROR, "Message is required");
                return;
            }
            protocolMessageData = {
                id: messageId,
                data: {
                    userId: user?.id,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                    message: data?.message,
                },
                type: ScenarioMessageTypes.MESSAGE,
                timestamp: Date.now(),
            };
        } else if (type === ScenarioMessageTypes.DECISION) {
            protocolMessageData = {
                id: messageId,
                data,
                type: ScenarioMessageTypes.DECISION,
                timestamp: Date.now(),
            };
        }

        await this.scenarioProgressCachingService.saveProtocolMessage(courseId, protocolMessageData);
        client.to(courseId).emit(SocketEvents.PROTOCOL, protocolMessageData);
        client.emit(SocketEvents.PROTOCOL, protocolMessageData);
    }


    /**
     * Funktion: handleGetCurrentProtocolHistory
     *
     * Diese Methode wird aufgerufen, um den aktuellen Stand des Szenarios
     * (inkl. Protokollnachrichten, Entscheidungen usw.) aus dem Cache abzurufen.
     * Der aktuelle Stand wird anschließend an den anfragenden Client sowie
     * alle Teilnehmer im Kursraum gesendet.
     *
     * @param courseId - ID des Szenarios/Kurses
     * @param client - WebSocket-Client, der die Anfrage gesendet hat
     */
    @ApiOperation({summary: "Get current protocol history"})
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                courseId: {type: "string"},
            },
        },
    })
    @UseGuards(WebSocketGuard)
    @SubscribeMessage(SocketEvents.GET_ACTUAL_SCENARIO_DATA)
    async handleGetCurrentProtocolHistory(
        @MessageBody()
        {courseId}: { courseId: string },
        @ConnectedSocket() client: Socket
    ) {
        if (!courseId) {
            client.emit(SocketEvents.ERROR, "Course Id is required");
            this.logger.error(
                `SOCKET EVENT:${SocketEvents.GET_ACTUAL_SCENARIO_DATA} - Course Id is required`
            );
            return;
        }

        const actualScenarioData = await this.scenarioProgressCachingService.getScenarioProgress(
            courseId,
            true // mit vollständigen Details
        );
        client.to(courseId).emit(SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
        client.emit(SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
    }

    /**
     * Funktion: handleScenarioAction
     *
     * Verarbeitet unterschiedliche Aktionen im Szenarioverlauf, die durch Benutzer ausgelöst werden.
     * Je nach Typ wird der aktuelle Szenarienfortschritt aktualisiert und ggf. eine gezielte Antwort gesendet.
     *
     * Unterstützte Aktionen:
     * - NEW_STAGE: neue Stage starten
     * - FINISH_SCENARIO: Szenario abschließen
     * - SHOW_SPOILER: Spoiler-Inhalte anzeigen (nur für bestimmte Nutzer)
     * - REMOVE_USER: Benutzer aus dem Szenario entfernen
     *
     * @param type - Typ der Aktion (aus `ScenarioActionTypes`)
     * @param data - Kontextdaten zur Aktion (z. B. Stage-ID, Benutzerinformationen)
     * @param courseId - ID des Szenarios/Kurses
     * @param client - WebSocket-Client, der die Aktion gesendet hat
     */
    @ApiOperation({summary: "Send scenario action"})
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                type: {type: typeof ScenarioActionTypes},
                data: {type: "any"},
                courseId: {type: "string"},
            },
        },
    })
    @UseGuards(WebSocketGuard)
    @SubscribeMessage(SocketEvents.SCENARIO_ACTION)
    async handleScenarioAction(
        @MessageBody()
        {type, data, courseId}: { type: ScenarioActionTypes; data: any; courseId: string },
        @ConnectedSocket() client: Socket
    ) {
        if (!data || !courseId || !type) {
            client.emit(SocketEvents.ERROR, "Data, course id and type are required");
            this.logger.error(
                `SOCKET EVENT:${SocketEvents.SCENARIO_ACTION} - Data, course id and type are required`
            );
            return;
        }

        let actualScenarioData: ScenarioProgress;

        if (type === ScenarioActionTypes.NEW_STAGE && data?.nextStageId) {
            // Wechselt zur nächsten Stage
            actualScenarioData = await this.goToNewStageHandler(courseId, data.nextStageId);

        } else if (type === ScenarioActionTypes.FINISH_SCENARIO) {
            // Szenario beenden
            await this.finalizeSession(courseId);
            return;

        } else if (type === ScenarioActionTypes.SHOW_SPOILER && data?.requesterEmail) {
            // Zeigt Spoiler-Inhalte für die aktuelle Stage
            const {existedProgress, spoilerContent} =
                await this.scenarioProgressCachingService.showCurrentStageSpoiler(
                    courseId,
                    data.requesterEmail
                );

            actualScenarioData = existedProgress;

            client.emit(SocketEvents.ACTION, {
                type: ScenarioActionTypes.SHOW_SPOILER,
                content: spoilerContent,
            });

        } else if (type === ScenarioActionTypes.REMOVE_USER && data?.user?.id) {
            // Entfernt den angegebenen Benutzer aus dem Szenario
            actualScenarioData = await this.scenarioProgressCachingService.removeUserFromScenario(
                courseId,
                data.user,
                client["user"]
            );

            const socketsInRoom = this.server.sockets.adapter.rooms.get(courseId);
            const targetSocketId = Array.from(socketsInRoom).find((socketId) => {
                const socket = this.server.sockets.sockets.get(socketId);
                return socket["user"]?.id === data?.user?.id;
            });

            if (targetSocketId) {
                // Benutzer ist online – sende Logout
                this.server
                    .to(targetSocketId)
                    .emit(SocketEvents.ACTION, {
                        type: ScenarioActionTypes.LOGOUT,
                        userId: data?.user?.id,
                    });
            } else {
                // Benutzer ist nicht mehr verbunden – aktualisiere die Liste
                const connectedUsers = await this.getConnectedUsersInRoom(courseId);
                client.emit(SocketEvents.UPDATE_CONNECTED_USERS, connectedUsers);
            }
        }

        // Sendet den aktuellen Stand nach ausgeführter Aktion
        if (actualScenarioData) {
            client.to(courseId).emit(SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
            client.emit(SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
        }
    }

    /**
     * Funktion: handleUpdateUser
     *
     * Diese Methode wird verwendet, um die Berechtigungen eines bestimmten Nutzers im Szenario zu aktualisieren.
     * Der Client, der die Änderung initiiert, bekommt eine aktualisierte Nutzerinformation zurück.
     * Ist der betroffene Nutzer aktiv, wird auch ihm ein Update gesendet.
     *
     * @param userId - ID des zu aktualisierenden Nutzers
     * @param updatedPermissions - Neue Berechtigungen des Nutzers
     * @param courseId - Kurs- oder Szenario-ID
     * @param client - Client, der das Update ausgelöst hat
     */
    @ApiOperation({summary: "Handle update user permissions"})
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                updatedPermissions: {type: typeof PermissionCodes},
                userId: {type: "string"},
                courseId: {type: "string"},
            },
        },
    })
    @UseGuards(WebSocketGuard)
    @SubscribeMessage(SocketEvents.UPDATE_USER)
    async handleUpdateUser(
        @MessageBody()
        {
            updatedPermissions,
            courseId,
            userId,
        }: { userId: string; updatedPermissions: PermissionCodes[]; courseId: string },
        @ConnectedSocket() client: Socket
    ) {
        if (!updatedPermissions || !courseId || !userId) {
            this.logger.error(
                `SOCKET EVENT:${SocketEvents.UPDATE_USER} - Updated permissions, course progress id and user id are required`
            );
            client.emit(
                SocketEvents.ERROR,
                "Updated permissions, course progress id and user id are required"
            );
            return;
        }

        const targetUser = await this.scenarioProgressCachingService.updateUserPermissions(
            courseId,
            userId,
            updatedPermissions
        );

        const socketsInRoom = this.server.sockets.adapter.rooms.get(courseId);

        const targetSocketId = Array.from(socketsInRoom).find((socketId) => {
            const socket = this.server.sockets.sockets.get(socketId);
            return socket["user"]?.id === userId;
        });

        // Antwort an Initiator mit aktualisierten Nutzerdaten
        this.server
            .to(client.id)
            .emit(SocketEvents.UPDATE_USER_INFO, {...targetUser, isActive: !!targetSocketId});

        // Antwort an betroffenen Nutzer selbst (falls online)
        if (targetSocketId && targetUser) {
            this.server
                .to(targetSocketId)
                .emit(SocketEvents.UPDATE_PERMISSIONS, {permissions: targetUser?.permissions ?? []});
        }
    }

    /**
     * Funktion: goToNewStageHandler
     *
     * Diese Methode führt den Wechsel zur nächsten Stage eines Szenarios durch.
     * Dabei werden mehrere Folgeaktionen ausgelöst:
     * - Wechsel der Stage über den Caching-Service
     * - Speichern von Entscheidungsoptionen (falls vorhanden)
     * - Hinzufügen von zeitverzögerten Inhalten
     * - Erkennung der finalen Phase und optionales Protokollieren des Endes
     *
     * @param courseProgressId - ID des Kursfortschritts/Szenarios
     * @param nextStageId - ID der nächsten Stage, zu der gewechselt werden soll
     * @returns aktualisierter Szenariofortschritt (inkl. JSON-Inhalt)
     */
    private async goToNewStageHandler(courseProgressId: string, nextStageId: number) {
        try {
            await this.scenarioProgressCachingService.goToNewStage(courseProgressId, nextStageId);
        } catch (error) {
            this.server
                .to(courseProgressId)
                .emit(SocketEvents.ERROR, {message: error?.message ?? "Failed to go to new stage"});
            return;
        }

        let actualScenarioData = await this.scenarioProgressCachingService.getScenarioProgress(
            courseProgressId,
            true
        );

        const currentStageData = actualScenarioData.json?.Content?.[actualScenarioData?.currentStage];

        // Falls Entscheidung notwendig ist → als neue Entscheidung in den Cache
        if (
            currentStageData &&
            currentStageData?.decisionOptions?.length &&
            currentStageData?.confirmationRequired
        ) {
            await this.scenarioProgressCachingService.pushNewDecision(courseProgressId, currentStageData);
        }

        // Falls zeitverzögerter Inhalt definiert ist → hinzufügen
        if (currentStageData.timeDelayedContent?.length) {
            await this.scenarioProgressCachingService.addTemporaryContent(
                courseProgressId,
                Date.now(),
                currentStageData.timeDelayedContent,
                currentStageData.id
            );
        }

        // Falls aktuelle Stage die letzte ist (finale Phase) → "END"-Protokolleintrag speichern
        if (this.checkIfFinalPhase(actualScenarioData)) {
            let protocolMessageData = {
                id: v4(),
                data: {},
                type: ScenarioMessageTypes.END,
                timestamp: Date.now(),
            };
            await this.scenarioProgressCachingService.saveProtocolMessage(
                courseProgressId,
                protocolMessageData
            );
        }

        // Rückgabe des aktualisierten Szenariodatenobjekts
        return this.scenarioProgressCachingService.getScenarioProgress(courseProgressId, true);
    }

    /**
     * Funktion: checkIfFinalPhase
     *
     * Diese Methode prüft, ob sich das Szenario in der letzten Phase befindet.
     * Eine finale Phase liegt vor, wenn:
     * - Keine Entscheidungsoptionen in der aktuellen Stage vorhanden sind, oder
     * - die aktuelle Stage die letzte im Szenario-Content ist.
     *
     * @param actualScenarioData - Aktuelle Daten zum Szenariofortschritt
     * @returns true, wenn finale Phase erreicht ist, sonst false
     */
    checkIfFinalPhase(actualScenarioData: ScenarioProgress) {
        if (actualScenarioData?.json?.Content) {
            const currentStageInfo =
                actualScenarioData?.json?.Content?.[actualScenarioData?.currentStage];

            if (!currentStageInfo?.decisionOptions?.length) {
                return true;
            }
        }

        return actualScenarioData?.currentStage ===
            actualScenarioData?.json.Content?.length - 1;
    }

    /**
     * Funktion: getConnectedUsersInRoom
     *
     * Diese Methode ermittelt die aktuell verbundenen Nutzer eines bestimmten Kursraums.
     * Sie basiert auf dem Socket.IO-Raumkonzept und gleicht aktive Sockets mit
     * den Benutzerdaten aus dem Cache ab. Dabei wird markiert, ob ein Nutzer gerade aktiv ist.
     *
     * @param courseProgressId - ID des Kursraums/Szenarios
     * @returns Liste aller Benutzer im Szenario, jeweils mit Angabe ob aktiv verbunden
     */
    async getConnectedUsersInRoom(courseProgressId: string) {
        const socketsInRoom = this.server.sockets.adapter.rooms.get(courseProgressId);

        const currentScenarioProgress = await this.scenarioProgressCachingService.getScenarioProgress(
            courseProgressId,
            true
        );

        const users = currentScenarioProgress?.users;

        if (!socketsInRoom || !users?.length) {
            return [];
        }

        const activeUsers = Array.from(socketsInRoom).reduce((acc, socketId) => {
            const socket = this.server.sockets.sockets.get(socketId);
            acc[socket["user"]?.email] = {
                id: socket["user"]?.id,
                firstName: socket["user"]?.firstName,
                lastName: socket["user"]?.lastName,
                email: socket["user"]?.email,
            };
            return acc;
        }, {} as Record<string, any>);

        // Markiert in der Benutzerliste, ob der jeweilige Nutzer aktiv im Raum ist
        return users.map((user) => ({
            ...user,
            isActive: !!activeUsers[user.email],
        }));
    }

    /**
     * Funktion: sessionTimeUpHandler
     *
     * Wird aufgerufen, wenn die Zeit für die aktuelle Stage abgelaufen ist.
     * Je nach Situation wird eine finale Entscheidung automatisch getroffen,
     * ein Übergang zur nächsten Phase durchgeführt oder das Szenario beendet.
     *
     * @param courseProgressId - ID des Szenario-/Kursverlaufs
     */
    private async sessionTimeUpHandler(courseProgressId: string) {
        const scenarioProgress =
            await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);

        const currentStage = scenarioProgress?.json?.Content?.[scenarioProgress.currentStage];

        const hasTimedDecision = currentStage?.decisionOptions?.length &&
            (currentStage?.timeLeftDecisionId ?? -1) !== -1;

        if (hasTimedDecision) {
            // Entscheidung anhand der Timeout-ID vorbereiten
            const decisionIndex = scenarioProgress.protocolHistory.findIndex(
                (message) =>
                    message.type === ScenarioMessageTypes.DECISION &&
                    message?.data?.name === currentStage?.decisionName
            );
            const timedOption = currentStage?.decisionOptions?.[currentStage?.timeLeftDecisionId];

            if (decisionIndex !== -1 && timedOption) {
                // Entscheidung aktualisieren
                scenarioProgress.protocolHistory[decisionIndex] = {
                    ...scenarioProgress.protocolHistory[decisionIndex],
                    data: {
                        ...scenarioProgress.protocolHistory[decisionIndex].data,
                        finalDecision: timedOption,
                    },
                };
                await this.scenarioProgressCachingService.setScenario(courseProgressId, scenarioProgress);
            } else {
                // Fehlerfall: Szenario entsperren
                this.scenarioProgressCachingService.unlockScenario(courseProgressId);
            }

            // Wechsel zur neuen Phase falls konfiguriert
            if (timedOption?.phaseId !== currentStage?.id) {
                if (timedOption?.phaseId <= scenarioProgress?.json?.Content?.length) {
                    const actualScenarioData = await this.goToNewStageHandler(courseProgressId, timedOption.phaseId);
                    this.server.to(courseProgressId).emit(SocketEvents.ACTUAL_SCENARIO_DATA, actualScenarioData);
                    return;
                } else if (timedOption?.phaseId > scenarioProgress?.json?.Content?.length) {
                    // Phase verweist über das Ende hinaus → beende Szenario
                    const resultStatus = currentStage?.phaseEndResult ?? CourseProgressEnum.Failed;
                    await this.finalizeSession(courseProgressId, resultStatus);
                    return;
                }
            }
        } else {
            this.scenarioProgressCachingService.unlockScenario(courseProgressId);
        }

        // Fallback: Szenario beenden
        const resultStatus = currentStage?.phaseEndResult ?? CourseProgressEnum.Failed;
        const scenario = await this.courseProgressService.finalizeSession(
            courseProgressId,
            resultStatus,
            AdditionalStatusInfoTags.TIMEUP
        );

        this.server.to(courseProgressId).emit(SocketEvents.ACTION, {
            type: ScenarioActionTypes.FINISH_SCENARIO,
            scenarioName: scenario.json?.scenarioName,
            status: resultStatus,
            additionalStatusInfo: scenario?.json?.Content?.[scenario.currentStage]?.phaseEndText
                ?? AdditionalStatusInfoTags.TIMEUP,
        });

        await this.scenarioProgressCachingService.removeActiveTimerStage(courseProgressId);
        await this.scenarioProgressCachingService.clearTemporaryContentForCourseProgress(courseProgressId);
    }

    /**
     * Funktion: finalizeSession
     *
     * Beendet ein Szenario offiziell. Es wird ein Abschluss-Event an die Clients gesendet
     * und alle temporären Inhalte sowie Timer werden entfernt.
     *
     * @param courseProgressId - ID des Kursverlaufs
     * @param status - Status des Abschlusses (z. B. Erfolg, Fehlgeschlagen)
     */
    private async finalizeSession(
        courseProgressId: string,
        status: CourseProgressEnum = CourseProgressEnum.Success
    ) {
        try {
            const scenario = await this.courseProgressService.finalizeSession(courseProgressId);
            const resultStatus = scenario?.json?.Content?.[scenario.currentStage]?.phaseEndResult ?? status;

            this.server.to(courseProgressId).emit(SocketEvents.ACTION, {
                type: ScenarioActionTypes.FINISH_SCENARIO,
                scenarioName: scenario.json?.scenarioName,
                status: resultStatus,
                additionalStatusInfo:
                    scenario?.json?.Content?.[scenario.currentStage]?.phaseEndText ?? AdditionalStatusInfoTags.SUCCESS,
            });

            await this.scenarioProgressCachingService.clearTemporaryContentForCourseProgress(courseProgressId);
            await this.scenarioProgressCachingService.removeActiveTimerStage(courseProgressId);
        } catch (error) {
            this.server.to(courseProgressId).emit(SocketEvents.ERROR, "Failed to finalize session");
            throw error;
        }
    }

    /**
     * Funktion: checkActiveScenariosTimers
     *
     * Wird regelmäßig ausgeführt (alle 1000ms), um aktive Timer zu prüfen.
     * Erkennt relevante Zeitmarken (z. B. noch 5 Minuten, noch 1 Minute)
     * und sendet entsprechende Protokollmeldungen.
     * Erkennt außerdem den Ablaufzeitpunkt und startet dann die `sessionTimeUpHandler`.
     */
    private async checkActiveScenariosTimers() {
        const currentTimeStamp = Date.now();
        const courseIds = await this.scenarioProgressCachingService.getActiveTimers();

        for (const [courseId, currentStageEndTimeStamp] of Object.entries(courseIds)) {
            if (currentStageEndTimeStamp) {
                const differenceInTime = currentStageEndTimeStamp - currentTimeStamp;

                if (differenceInTime <= 300000 && differenceInTime > 299000) {
                    // Noch 5 Minuten
                    const message = {
                        id: v4(),
                        data: {
                            title: "end-session",
                            description: "time-up",
                            type: ServiceMessageType.INFO,
                            descriptionOptions: {leftTime: 5},
                        },
                        type: ScenarioMessageTypes.SERVICE,
                        timestamp: currentTimeStamp,
                    };
                    await this.scenarioProgressCachingService.saveProtocolMessage(courseId, message);
                    this.server.to(courseId).emit(SocketEvents.PROTOCOL, message);

                } else if (differenceInTime <= 60000 && differenceInTime > 59000) {
                    // Noch 1 Minute
                    const message = {
                        id: v4(),
                        data: {
                            title: "end-session",
                            description: "time-up",
                            type: ServiceMessageType.INFO,
                            descriptionOptions: {leftTime: 1},
                        },
                        type: ScenarioMessageTypes.SERVICE,
                        timestamp: currentTimeStamp,
                    };
                    await this.scenarioProgressCachingService.saveProtocolMessage(courseId, message);
                    this.server.to(courseId).emit(SocketEvents.PROTOCOL, message);

                } else if (differenceInTime < 1000) {
                    // Zeit abgelaufen
                    await this.sessionTimeUpHandler(courseId);
                }
            }
        }
    }

    /**
     * Funktion: checkACtiveScenariosTimeBasedContent
     *
     * Diese Funktion wird regelmäßig aufgerufen und verarbeitet zeitgesteuerte Inhalte:
     * - Inhalte, die jetzt angezeigt werden sollen
     * - Inhalte, die jetzt entfernt werden sollen
     *
     * Nach Änderungen wird der aktualisierte Szenarienfortschritt an die Teilnehmer gesendet.
     */
    private async checkACtiveScenariosTimeBasedContent() {
        const currentTimeStamp = Date.now();
        const temporaryContent = await this.scenarioProgressCachingService.getTemporaryContent();
        const dataForRemoving: { courseProgressId: string; contentIds: string[] }[] = [];

        for (const [courseProgressId, courseTemporaryContent] of Object.entries(temporaryContent)) {
            if (!courseTemporaryContent?.length) continue;

            const contentIdsForRemoving: string[] = [];
            let currentCourseProgress = null;

            for (const content of courseTemporaryContent) {
                const isWithinShowingTime =
                    content?.startShowingTime - 500 < currentTimeStamp &&
                    content?.startShowingTime + 500 > currentTimeStamp;

                const isWithinDeleteTime =
                    content?.deleteTime - 500 < currentTimeStamp &&
                    content?.deleteTime + 500 > currentTimeStamp;

                if (isWithinShowingTime || isWithinDeleteTime) {
                    if (!currentCourseProgress) {
                        currentCourseProgress = await this.scenarioProgressCachingService.getScenarioProgress(courseProgressId);
                    }

                    if (isWithinShowingTime) {
                        // Inhalt anzeigen
                        let newContent = content.stageInfo;
                        console.log("📦 content.stageInfo", JSON.stringify(content.stageInfo, null, 2));

                        if (!newContent?.stageNumber && newContent?.stageNumber !== 0) {
                            newContent.stageNumber = currentCourseProgress?.json?.Content?.[currentCourseProgress.currentStage]?.id;
                        }
                        currentCourseProgress.stageContent.push(newContent);
                        if (!content?.deleteTime) {
                            contentIdsForRemoving.push(content.stageInfo?.id);
                        }
                    } else if (isWithinDeleteTime) {
                        // Inhalt entfernen (visuell als "entfernt" markieren)
                        currentCourseProgress.stageContent = currentCourseProgress.stageContent.map((item) => {
                            if (item?.id === content.stageInfo?.id) {
                                return {...item, isRemoved: true};
                            }
                            return item;
                        });
                        contentIdsForRemoving.push(content.stageInfo?.id);
                    }
                }
            }

            if (contentIdsForRemoving.length) {
                dataForRemoving.push({courseProgressId, contentIds: contentIdsForRemoving});
            }

            if (currentCourseProgress) {
                await this.scenarioProgressCachingService.setScenario(courseProgressId, currentCourseProgress);
                this.server.to(courseProgressId).emit(SocketEvents.ACTUAL_SCENARIO_DATA, currentCourseProgress);
            }
        }

        if (dataForRemoving.length) {
            await this.scenarioProgressCachingService.removeTemporaryContentArray(dataForRemoving);
        }
    }
}


