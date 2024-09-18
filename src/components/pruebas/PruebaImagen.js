import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { uploadImage, getImageByName } from '../../services/imageService';

const useStyles = makeStyles(() => ({
  image: {
    width: '150px',
    height: '150px',
    objectFit: 'cover', // Para mantener la proporción de la imagen
    cursor: 'pointer',
  },
}));

const PruebaImagen = () => {
  const classes = useStyles(); // Usar los estilos definidos
  const [isEditing, setIsEditing] = useState(false);
  const [imageURL, setImageURL] = useState(process.env.REACT_APP_IMAGES_URL+'/image/image-1726702171765-192531645.png'); // URL de la imagen a mostrar
  const [imageName, setImageName] = useState(''); // Nombre de la imagen en el servidor

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Cambia entre "editar" y "editando"
  };

  const handleImageClick = async (e) => {
    if (!isEditing) return; // Si no está en modo de edición, no permite cargar la imagen

    const file = e.target.files[0]; // Seleccionar archivo
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const result = await uploadImage(formData); // Subir imagen al servidor
      setImageName(result.filename); // Guardar el nombre de la imagen
      const fetchedImage = await getImageByName(result.filename); // Obtener la imagen por el nombre
      const imageObjectURL = URL.createObjectURL(fetchedImage); // Crear URL temporal para mostrar
      setImageURL(imageObjectURL); // Actualizar el URL de la imagen para mostrarla
    } catch (error) {
      console.error('Error al cargar o obtener la imagen:', error.message);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleEditToggle}>
        {isEditing ? 'Editando' : 'Editar'} {/* Cambia el texto del botón */}
      </Button>

      {/* Si está en modo edición, el input de imagen es clickeable */}
      <div>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="fileInput"
          onChange={handleImageClick}
        />
        <img
          src={imageURL || 'https://via.placeholder.com/150'} // Mostrar una imagen por defecto si no hay
          alt="imagen"
          onClick={() => isEditing && document.getElementById('fileInput').click()} // Al hacer clic en la imagen, abre el selector de archivos
          className={classes.image} // Aplicar los estilos de Material-UI
        />
      </div>
    </div>
  );
};

export default PruebaImagen;

