import { domicileService } from '../utils/api';

export const getAllDomicilios = async () => {
  const response = await domicileService.get('/domicilios');
  return response.data;
};

export const getDomiciliosByEstado = async (estado) => {
    const response = await domicileService.get(`/domicilios/estado/${estado}`);
    return response.data;
  };  

export const getDomicilioById = async (id) => {
  const response = await domicileService.get(`/domicilios/${id}`);
  return response.data;
};

export const createDomicilio = async (domicilioData) => {
  const response = await domicileService.post('/domicilios', domicilioData);
  return response.data;
};

export const aceptarDomicilio = async (id, domicilioData) => {
  const response = await domicileService.put(`/domicilios/${id}/aceptar`, domicilioData);
  return response.data;
};

export const cancelarDomicilio = async (id) => {
  const response = await domicileService.put(`/domicilios/${id}/cancelar`);
  return response.data;
};

export const completarDomicilio = async (id) => {
  const response = await domicileService.put(`/domicilios/${id}/completar`);
  return response.data;
};

export const actualizarUbicacionProfesional = async (id, ubicacionProfesional) => {
  const response = await domicileService.put(`/domicilios/${id}/ubicacionProfesional`, ubicacionProfesional);
  return response.data;
};

export const getUbicacionProfesionalById = async (id) => {
  const response = await domicileService.get(`/domicilios/${id}/ubicacionProfesional`);
  return response.data;
};

