import pkg from "whatsapp-web.js"
const { Client, LocalAuth } = pkg
import WhatsappService from "./whatsapp-service.js"
import qrcode from 'qrcode-terminal';

import { Logger } from '../../logger.js';


const gWhatsappInstance = async ({
    db
}) => {
  
  const client =  new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox'] },
  });

  const whatsappService = new WhatsappService({ client })
    
  whatsappService.client.on('qr', (qr) => {
    console.log('\n📱 Scan the QRCode bellow with your whatsapp:\n');
    qrcode.generate(qr, { small: true });
  });

  await new Promise((resolve) => {
    whatsappService.client.on('ready', () => {
      Logger.info('WhatsApp client is ready');
      resolve();
    });
    whatsappService.init()
  });

  return { whatsappService }
}
export {
    gWhatsappInstance
}