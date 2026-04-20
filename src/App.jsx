//importacion de librerias de estilos y componentes 
import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

// creacion de componenteApp (logica de app y manejo de estados)
function App() {
  // La claveDeAPI contiene la api key que me da la plataforma de clima openweather y se usa para conectarme a la API de clima 
  const claveDeAPI = "52735079525e0c4aa632d55079da273a";

  //estados de la aplicacion mediante useState para poder guardar los datos que necesito del usuario 1ra seccion 
  const [continenteSeleccionado, setContinenteSeleccionado] = useState("");
  const [paisSeleccionado, setPaisSeleccionado] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [temperaturaSeccion1, setTemperaturaSeccion1] = useState(null);
  const [errorSeccion1, setErrorSeccion1] = useState("")

  // estados de la aplicacion mediante useState para poder guardar los datos que necesito del usuario de la 2da seccion
  const [textoBusquedaDeZona, setTextoBusquedaDeZona] = useState("");
  const [temperaturaSeccion2, setTemperaturaSeccion2] = useState(null);
  const [errorSeccion2, setErrorSeccion2] = useState("");

  // Datos para llenar los select (1ra seccion - 1er input - de continentes)
  // uso de objetos para guardar los continentes 
  const opcionesDeContinentesYPaises = {
    "América": ["Argentina", "Brasil", "Chile", "México", "Colombia", "Estados Unidos", "Canadá"],
    "Europa": ["España", "Francia", "Italia", "Alemania", "Reino Unido"],
    "Asia": ["Japón", "China", "India", "Corea del Sur"],
    "África": ["Sudáfrica", "Egipto", "Marruecos"],
    "Oceanía": ["Australia", "Nueva Zelanda"]
  };

  // Datos para llenar el select (1ra seccion) de provincias según el país
  // uso de objetos para guardar las provincias según el país
  const opcionesDeProvinciasPorPais = {
    "Argentina": ["Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"],
    "España": ["Madrid", "Cataluña", "Andalucía", "Valencia", "Galicia"],
    "México": ["Ciudad de México", "Jalisco", "Nuevo León", "Puebla", "Yucatán"],
    "Estados Unidos": ["California", "Texas", "Florida", "Nueva York", "Illinois"]
  };

  // Función principal para buscar el clima
  // try y catch es para manejar los errores de la peticion a la API de clima
  const funcionParaBuscarElClima = async (lugarABuscar, funcionParaGuardarTemperatura, funcionParaGuardarError) => {
    try {
      funcionParaGuardarError("");
      funcionParaGuardarTemperatura(null);

      // Usamos version 2.5 de la API de openweather. la funcion axios.get es para hacer la peticion a la API de clima 
      const urlDelClima = `https://api.openweathermap.org/data/2.5/weather?q=${lugarABuscar}&appid=${claveDeAPI}&units=metric`;
      const respuestaDelClima = await axios.get(urlDelClima);

      // Extraer la temperatura del resultado 
      const temperaturaEncontrada = respuestaDelClima.data.main.temp;
      funcionParaGuardarTemperatura(temperaturaEncontrada);
 
    } catch (errorDelServidor) {
      console.error("Error al buscar el clima:", errorDelServidor);
      funcionParaGuardarError("No se encontró el lugar o hubo un problema de conexión. Intenta de nuevo.");
    }
  };

  // Manejador del cambio en el select del país (Sección 1)
  const manejarElCambioDelPais = (eventoDelSelect) => {
  
  // con target capturamos el valor del select y con value obtenemos el valor de ese select 
    const nuevoPaisElegido = eventoDelSelect.target.value; 
    setPaisSeleccionado(nuevoPaisElegido);
    setProvinciaSeleccionada("");
    setTemperaturaSeccion1(null);
    setErrorSeccion1("");
    
    if (nuevoPaisElegido !== "") {

      // Si el país no tiene provincias registradas, buscamos el clima directamente
      if (!opcionesDeProvinciasPorPais[nuevoPaisElegido]) {
        funcionParaBuscarElClima(nuevoPaisElegido, setTemperaturaSeccion1, setErrorSeccion1);
      }
    }
  };

  // Manejador del cambio en el select de provincia (Sección 1)
  const manejarElCambioDeProvincia = (eventoDelSelect) => {
    const nuevaProvincia = eventoDelSelect.target.value;
    setProvinciaSeleccionada(nuevaProvincia);
    
    if (nuevaProvincia !== "") {
      // Buscamos el clima enviando la provincia y el país para mayor precisión
      const ubicacionABuscar = `${nuevaProvincia}, ${paisSeleccionado}`;
      funcionParaBuscarElClima(ubicacionABuscar, setTemperaturaSeccion1, setErrorSeccion1);
    } else {
      setTemperaturaSeccion1(null);
    }
  };

  // Manejador del clic en el botón de buscar (Sección 2)
  const manejarElBotonDeBusqueda = () => {
    if (textoBusquedaDeZona.trim() !== "") {
      funcionParaBuscarElClima(textoBusquedaDeZona, setTemperaturaSeccion2, setErrorSeccion2);
    } else {
      setErrorSeccion2("Por favor, ingresa una zona para buscar correctamente.");
    }
  };

  // return es para poder mostrar los datos en la pantalla 
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center py-12 px-4 font-sans">
      
      <h1 className="text-4xl font-extrabold text-blue-900 text-center drop-shadow-md">
        Clima y Pronostico del Tiempo
      </h1>
      <h3 className='text-2xl font-bold text-blue-800 mb-5 flex items-center gap-2'>Busca tu mejor clima aca!</h3>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* === 1RA SECCIÓN: SELECT DE CONTINENTES Y PAÍSES === */}
        <div className="bg-white p-8 rounded-2xl box-border shadow-amber-500 shadow-xl hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🌍 Búsqueda por Lista
          </h2>
          
          <div className="flex flex-col gap-5">
            {/* Input de Select - Continente */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Selecciona tu Continente:
              </label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                value={continenteSeleccionado}
                onChange={(evento) => {
                  setContinenteSeleccionado(evento.target.value);
                  setPaisSeleccionado("");
                  setProvinciaSeleccionada("");
                  setTemperaturaSeccion1(null);
                  setErrorSeccion1("");
                }}
              >
                <option value="">-- Escoge una opción --</option>
                {Object.keys(opcionesDeContinentesYPaises).map((nombreDelContinente) => (
                  <option key={nombreDelContinente} value={nombreDelContinente}>
                    {nombreDelContinente}
                  </option>
                ))}
              </select>
            </div>

            {/* Input de Select - País */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Selecciona tu País:
              </label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                value={paisSeleccionado}
                onChange={manejarElCambioDelPais}
                disabled={continenteSeleccionado === ""}
              >
                <option value="">-- Escoge una opción --</option>
                {continenteSeleccionado && opcionesDeContinentesYPaises[continenteSeleccionado].map((nombreDelPais) => (
                  <option key={nombreDelPais} value={nombreDelPais}>
                    {nombreDelPais}
                  </option>
                ))}
              </select>
            </div>

            {/* Input de Select - Provincia (Solo si aplica al país) */}
            {paisSeleccionado && opcionesDeProvinciasPorPais[paisSeleccionado] && (
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Selecciona tu Provincia / Estado:
                </label>
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                  value={provinciaSeleccionada}
                  onChange={manejarElCambioDeProvincia}
                >
                  <option value="">-- Escoge una provincia --</option>
                  {opcionesDeProvinciasPorPais[paisSeleccionado].map((nombreDeProvincia) => (
                    <option key={nombreDeProvincia} value={nombreDeProvincia}>
                      {nombreDeProvincia}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mensajes y Resultados */}
            {errorSeccion1 && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg font-medium text-sm">
                {errorSeccion1}
              </div>
            )}

            {temperaturaSeccion1 !== null && !errorSeccion1 && (
              <div className="mt-4 p-6 bg-blue-50 rounded-xl text-center border border-blue-200">
                <p className="text-gray-600 font-medium mb-1">
                  Temperatura actual en {provinciaSeleccionada ? `${provinciaSeleccionada}, ${paisSeleccionado}` : paisSeleccionado}:
                </p>
                <p className="text-5xl font-black text-blue-700">La temperatura en {provinciaSeleccionada.toLowerCase()} es de {Math.round(temperaturaSeccion1)}°C</p>
              </div>
            )}
          </div>
        </div>

        {/* === 2DA SECCIÓN: INPUT DE BÚSQUEDA LIBRE === */}
        <div className="bg-white p-8 rounded-2xl box-border shadow-amber-500 shadow-xl hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🔍 Búsqueda Libre
          </h2>
          
          <div className="flex flex-col gap-5">
            {/* Input para buscar País / Zona */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Ingresa País, Ciudad o Zona Geográfica:
              </label>
              <input 
                type="text"
                placeholder="Ej. Argentina, Córdoba, Rio Cuarto"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={textoBusquedaDeZona}
                onChange={(evento) => {
                  const nuevoValor = evento.target.value;
                  setTextoBusquedaDeZona(nuevoValor);
                  setErrorSeccion2(""); // Limpiamos error al escribir
                  if (nuevoValor.trim() === "") {
                    setTemperaturaSeccion2(null);
                  }
                }}
                onKeyDown={(evento) => {
                  if (evento.key === 'Enter') manejarElBotonDeBusqueda();
                }}
              />
            </div>

            {/* Botón de búsqueda */}
            <button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={manejarElBotonDeBusqueda}
            >
              Buscar Temperatura
            </button>

            {/* Mensajes y Resultados */}
            {errorSeccion2 && (
              <div className="bg-blue-100 text900 text-amber-900 p-3 rounded-lg font-medium text-sm">
                {errorSeccion2}
              </div>
            )}

            {temperaturaSeccion2 !== null && !errorSeccion2 && (
              <div className="mt-4 p-6 bg-green-50 rounded-xl text-center border border-green-200">
                <p className="text-gray-600 font-medium mb-1">Temperatura en tu búsqueda:</p>
                <p className="text-5xl font-black text-blue-700">La temperatura en {textoBusquedaDeZona.toLowerCase()} es de {Math.round(temperaturaSeccion2)}°C</p>
              </div>
            )}
          </div>
        </div>
      </div> <br /><br />
          <footer>
            <p className='text-center text-bold font-medium text-blue-800 text-sm'>Trabajo práctico del Estudiante German Andres RAMIREZ PEDERNERA</p>
          </footer>
    </div>
  );
}

export default App;
