export async function getTextFromImage(client, imagePath) {
    try {
        const [result] = await client.textDetection(imagePath);

        return result.fullTextAnnotation.text;
    }
    catch (e) {
        throw e
    }
};
