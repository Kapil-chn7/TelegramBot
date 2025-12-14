import express from "express";
import sgMail from "@sendgrid/mail"
import vision from "@google-cloud/vision"
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
import fs from "fs"
import { getTextFromImage } from "./utility.js"
const app = express();
const PORT = 8000;

// Default route

configDotenv();
app.get("/", (req, res) => {
    res.send("Hello from Express 🚀");
});

app.post("/sendemail", async (req, res) => {
    // console.log("Req", req)
    try {

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const resumePath = "/Users/kapil/Downloads/Kapil Chauhan CV (1).pdf"; // adjust path if needed
        const resumeFile = fs.readFileSync(resumePath).toString("base64");

        const msg = {
            to: "ashishchn7@gmail.com", // hiring manager
            from: "kapilchn7@gmail.com", // must be verified in SendGrid
            subject: "Application for Software Engineer — Kapil Ch",
            text: `Hi , I'm interested in the Software Engineer position.`,
            html: `
      <p>Hi,</p>
      <p>I hope you're doing well.</p>
      <p>
        My name is Kapil, and I'm reaching out because I’m interested in the Software Engineer role.
        I have experience in JavaScript, Node.js, and backend engineering, and I believe I would be a great fit for your team.
      </p>
      <p>I’ve attached my resume for your review and would appreciate the opportunity to discuss further.</p>
      <p>Thank you,<br/>Kapil</p>
    `,
            attachments: [
                {
                    content: resumeFile,
                    filename: "Kapil_Resume.pdf",
                    type: "application/pdf",
                    disposition: "attachment"
                }
            ]
        };


        await sgMail
            .send(msg);
        res.sendStatus(200);

    }
    catch (e) {
        console.log("Error occured " + e)
        res.sendStatus(500)

    }
})

async function getTextfromImage(){
    
}

app.post("/extractinfo", async (req, res) => {
    try {
        // Creates a client
        const client = new vision.ImageAnnotatorClient({
            apiKey: process.env.GOOGLE_VISION_API
        });
        const fileName = ["./asset/image1.jpeg"]
        const result = await getTextFromImage(client, fileName[0]);
        // const payload = {
        //     prompt: {
        //         text: `This is the job description : ${{ result }}, 
        // Note this is just demo will share instructions later, for now just give a success response, 
        // say its working when u return the output`},
        //     maxTokens: 512
        // };

        //         const prompt = `
        // This is the job description text or it could be a some text linkedin post or if it does not mention name and email no worries just write casual email : 

        // ${result}
        // And here is the past work experience and my history, 
        // ${perviousHistory}, look, I need to send an email to the person mentioned in the job description if email or name available then target it else do not target it, mention my achievenments or works that you think should be mentioned, 
        // Note: because I won't monitor this so no comments or nothing other than what is necessay, 
        // also here is the format of the email
        //  subject: "mention the subject here ",
        //             text: "mention text here",
        //             html: 
        //      <p>Hi,</p>
        //       <p>Starting line</p>
        //       <p>
        //         about me & from where I get to know about u </p>
        //       <p>attached resume like this content  <p>salutation<br/>name of me</p>
        //     , 
        //     note I'm using send grid so fill it with ' not with " and make it look like human has written this.
        //   `;

        const profile = "Kapil Chauhan (+91)7834820637 kapilchn7@gmail.com kapilchauhan200 Software Developer building scalable, AI-enabled applications Leetcode Profile Github New Delhi, India visit:(https://kapilai.github.io) 2019-2023 2017-2019 Nov 2023-Present Sep 2022-Mar 2023 Education B.Tech in Information and Technology Guru Gobind Singh Indraprastha University, New Delhi, India XII-CBSC Board, Air Force Senior Secondary School, New Delhi CGPA:8.4 83.40% Professional Experience Software Engineer, Digital, TCS, Chennai Worked on building backend microservices for Japan Airlines’ post-booking management system, developed PNR retrieval, seat services, email notifications, barcode generation, Aircraft databases, Chatbots, etc, and its integration with external systems like Amedus, Also developed PoC AI solutions: FAQ chatbot using Retrieval-Augmented Generation (RAG) with Pinecone (vector search), LangChain (pipeline orchestration), and LLMs (OpenAI GPT) for conversational responses. Voice-call automation for customer queries using Whisper AI (speech-to-text), Amazon Polly (text-to-speech), and Twilio API for call execution with multilingual support. Optimized system performance by 40% through SQL tuning, database indexing, and Ehcache-based API caching. Implemented a rule engine with 99% automated testing, reducing manual QA effort significantly. Reduced JAR size by 40% and improved AWS Lambda cold start performance by 95ms by refining Java libraries. Delivered robust code quality with 85%+ JUnit test coverage, set up performance testing infrastructure, and conducted RCA & impact analysis for production issues. Documented APIs (Swagger) and supported end-to-end testing with SoapUI and Postman. Tech Stack: Java, JavaScript, Spring Boot, Node.js, Pinecone, Whisper AI, Langchain, RAG, LLMs, PostgreSQL, AWS (ECS, SQS, Lambda, Aurora DB, DynamoDB), Kafka, Redis, Docker, Bitbucket, Jira. Software Engineer, Intern, NeonFlake Enterprise, Hyderabad (Website) Led end-to-end development of a web platform for a NGO, covering frontend, backend, and CMS systems. Built custom payment gateway API, enabling ₹15L+ in donations and onboarding 100+ users. Developed an interactive map with custom location-based navigation, without third-party services. Engineered backend architecture for authentication, role management & Erds creation for databases. Created UI/UX with ReactJS, Material-UI, and prototyped interfaces using Figma. Deployed applications using Vercel, integrated Cloudinary & Aws for media management. Tech Stack: JavaScript, ReactJS, Node.js, MongoDB, Vercel, Cloudinary, Aws, Figma, GitHub, Jenkins, Asana. Project Work Emotion Detection Using CNNs Implemented a facial emotion detection model to recognize the 7 sentiments (emotions) of a user while watching movies, utilizing the image processing and convolutional neural networks (CNNs). Mentored a team of three members and worked on image processing and Convolutional Neural Networks. Technology Involved: Python, PyTorch, Keras, TensorFlow, CNNs. Skills C++, C, Python, JavaScript, Java, NodeJs, SpringBoot, MongoDB, Postgres, Junit, JPA, Prisma ORM, React.Js, VueJs, Soap UI, Redis, Docker, Aws, Kafka, Jenkins, ML & LLMs. Achievements TCS–Special Initiative Award for driving innovation that improved project efficiency. 1st rank in Chess Tournament (TCS Japan Delivery Center). Nasa Space Apps Semi Finalists. IICC Coding Championship Semi Finalist. Accio Wars Coding Challenge (911 rank among 11k+ contestants). Hobbies and Languages Chess:2200+ Rating on Chess.com & lichess (Arena Fide Master Title). Languages: English, Hindi(Fluent), and Japanese.";

        const prompt =
            "You are writing a short cold outreach email based on the job description and my background.\n\n" +
            "--- JOB DESCRIPTION / POST ---\n" +
            result +
            "\n--------------------------------\n\n" +
            "--- MY EXPERIENCE & HISTORY ---\n" +
            profile +
            "\n--------------------------------\n\n" +
            "TASK:\n" +
            "Create a concise outreach email expressing interest in the opportunity.\n" +
            "The email should feel personal, relevant, and human-written.\n\n" +
            "REQUIREMENTS:\n" +
            "- If the post includes a name/email, address the person directly.\n" +
            "- If not, use a neutral greeting such as 'Hi there,' or 'Hello,'.\n" +
            "- Keep it short: MAX 120 words.\n" +
            "- Mention only relevant experience or achievements (not everything).\n" +
            "- Reference how I came across the opportunity if possible.\n" +
            "- Avoid corporate tone and avoid sounding AI-generated.\n" +
            "- Do NOT include comments, explanations, or placeholders.\n" +
            "- Do NOT restate instructions.\n\n" +
            "OUTPUT FORMAT (use single quotes `'` NOT double quotes):\n" +
            "{\n" +
            "  'subject': 'A short subject line based on the role',\n" +
            "  'text': 'plain text version of the message',\n" +
            "  'html': '<p>HTML version of the message with <br/> line breaks</p>'\n" +
            "}\n\n" +
            "Tone: Friendly, confident, brief, and natural.\n";

        const response = await callGemini(prompt)
        console.log(response)
        console.log(response.response.text());
        res.sendStatus(200)

    }
    catch (e) {
        console.log("Error " + e)
        res.sendStatus(500);

    }
})





async function callGemini(payload) {

    try {
        const apiKey = process.env.GOOGLE_VISION_API;
        // const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"
        // const resp = await fetch(endpoint, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${apiKey}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(payload)
        // });
        // const j = await resp.json();
        // console.log("Response:", j);

        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        const response = await model.generateContent(payload);
        return response

    }
    catch (e) {
        throw e
    }
}

// callGemini().catch(console.error);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
