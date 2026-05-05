import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function downloadFile(fileUrl: string, outputLocationPath: string): Promise<any> {
	const stream = await axios({
		method: "get",
		url: fileUrl,
		responseType: "stream",
	});

	return await fs.promises.writeFile(outputLocationPath, stream.data);
}
