import express, { Request, Response } from "express";
import fs from "fs-extra";
import { toBuffer } from "qrcode";
import CryptoJS from "crypto-js";
import JSZip from "jszip";
import { createWriteStream } from "fs";
import {delay,useMultiFileAuthState, BufferJSON, fetchLatestBaileysVersion,Browsers,default as makeWASocket,} from "@whiskeysockets/baileys";
import pino from "pino";
import { IncomingMessage } from "http";
import PastebinAPI from "pastebin-js";

const app = express();
const zip = new JSZip();
const pastebin = new PastebinAPI("h4cO2gJEMwmgmBoteYufW6_weLvBYCqT");
const PORT = process.env.PORT || 3000;

app.use("/", (req: Request, res: Response) => {
  async function Vorterx() {
    try {
      const { version, isLatest } = await fetchLatestBaileysVersion();
      const { state, saveCreds } = await useMultiFileAuthState(`./session`);
      const session = makeWASocket({
        logger: pino({
          level: 'silent'
        }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Desktop"),
        auth: state,
        version
      });

      session.ev.on("connection.update", async (s) => {
        if (s.qr) {
          res.end(await toBuffer(s.qr));
        }
        const { connection, lastDisconnect } = s;
        if (connection === "open") {
          const authfile = `./session/creds.json`;
          await delay(1000 * 10);

          let link = await pastebin.createPasteFromFile(
            authfile,
            "Vorterx",
            null,
            0,
            "N"
          );
          let data = link.replace("https://pastebin.com/", "");
          let code = btoa(data);
          var words = code.split("");
          var ress = words[Math.floor(words.length / 2)];
          let c = code.split(ress).join(ress + "_G_HOST_");
          await session.sendMessage(session.user.id, {
            text: `${c}`
          });
          await session.sendMessage(session.user.id, {
            text: `\n*ᴅᴇᴀʀ ᴜsᴇʀ ᴛʜɪs ɪs ʏᴏᴜʀ sᴇssɪᴏɴ ɪᴅ*

          ◕ ⚠️ *ᴘʟᴇᴀsᴇ ᴅᴏ ɴᴏᴛ sʜᴀʀᴇ ᴛʜɪs ᴄᴏᴅᴇ ᴡɪᴛʜ ᴀɴʏᴏɴᴇ ᴀs ɪᴛ ᴄᴏɴᴛᴀɪɴs ʀᴇǫᴜɪʀᴇᴅ ᴅᴀᴛᴀ ᴛᴏ ɢᴇᴛ ʏᴏᴜʀ ᴄᴏɴᴛᴀᴄᴛ ᴅᴇᴛᴀɪʟs ᴀɴᴅ ᴀᴄᴄᴇss ʏᴏᴜʀ ᴡʜᴀᴛsᴀᴘᴘ*`
          });

         
         process.send('reset');
         });
         }
        if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode != 401
        ) {
          Vorterx();
        }
      });

      session.ev.on("creds.update", saveCreds);
      await delay(3000 * 10);
      session.ev.on("messages.upsert", () => {});
    } catch (err) {
      console.log(
        err + "Unknown Error Occured Please report to Owner and Stay tuned"
      );
    }
  }
  Vorterx();
  });

  app.listen(PORT, () => console.log("App listened on port", PORT));
