"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomizeArray = exports.getRandomChars = exports.getRandomDigits = exports.getRandomSpecials = void 0;
const getRandomSpecials = (number) => Array(number)
    .fill("")
    .map(() => ["#", "$", "%", "&", "*"][Math.floor(Math.random() * 5)]);
exports.getRandomSpecials = getRandomSpecials;
const getRandomDigits = (number) => Array(number)
    .fill("")
    .map(() => Math.floor(Math.random() * 10).toString());
exports.getRandomDigits = getRandomDigits;
const getRandomChars = (number) => Array(number)
    .fill("")
    .map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("")[Math.floor(Math.random() * 52)]);
exports.getRandomChars = getRandomChars;
const randomizeArray = (array, newArray = []) => {
    const arrayCopy = [...array];
    const randomElement = arrayCopy.splice(Math.floor(Math.random() * arrayCopy.length), 1);
    newArray.push(randomElement[0]);
    if (arrayCopy.length === 0) {
        return newArray;
    }
    return (0, exports.randomizeArray)(arrayCopy, newArray);
};
exports.randomizeArray = randomizeArray;
//# sourceMappingURL=random.utils.js.map