import pkg from "whatsapp-web.js"
const { Client, LocalAuth } = pkg
import WhatsappService from "./whatsapp-service.js"
import * as qrcode from 'qrcode-terminal';


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
      console.log('✅ Bot connected to whatsapp');
      resolve();
    });
    whatsappService.init()
  });

  return { whatsappService }
}
export {
    gWhatsappInstance
}