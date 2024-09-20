import { emailService } from '../utils/api';

/**
 * Envía un correo electrónico a múltiples destinatarios.
 * @param {Array} emails - Lista de correos electrónicos.
 * @param {String} subject - Asunto del correo.
 * @param {String} content - Contenido del correo.
 * @param {Array} files - Archivos a enviar.
 * @returns {Promise} - Promesa que resuelve cuando se envía el correo.
 */

const sendEmail = async (emails, subject, content, files) => {
  const formData = new FormData();

  // Agregar los campos al FormData
  formData.append('emails', JSON.stringify(emails));
  formData.append('subject', subject);
  formData.append('content', content);

  // Agregar archivos al FormData
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await emailService.post('/send-email', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al enviar el correo: ' + error.message);
  }
};

export { sendEmail };