import { toPng } from 'html-to-image';
import { Dices, Download, ExternalLink, Settings, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_FONTS, GOOGLE_FONTS } from './fonts';

/**
 * Componente principal de la aplicación "Abejorro Digital: Tipografía".
 * Gestiona el estado global de la frase a visualizar, las tipografías seleccionadas
 * y la visibilidad del panel de configuración.
 * 
 * @returns {JSX.Element} La interfaz principal de la aplicación.
 */
export default function App() {
  const [phrase, setPhrase] = useState('¡Qué fugaz! El Abejorro Digital vibró: buscó whisky, jazmín y xilófonos en 120Hz.');
  const [selectedFonts, setSelectedFonts] = useState<string[]>(DEFAULT_FONTS);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  /**
   * Efecto secundario que carga dinámicamente las tipografías de Google Fonts.
   * Inyecta una etiqueta <link> en el <head> del documento cada vez que cambian
   * las tipografías seleccionadas para asegurar que se rendericen correctamente.
   */
  useEffect(() => {
    const fontFamilies = selectedFonts.map(font => font.replace(/ /g, '+'));
    const url = `https://fonts.googleapis.com/css2?${fontFamilies.map(f => `family=${f}:wght@400;700`).join('&')}&display=swap`;

    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [selectedFonts]);

  /**
   * Actualiza una tipografía específica en la lista de tipografías seleccionadas.
   * 
   * @param {number} index - El índice de la tipografía a cambiar (0-11).
   * @param {string} newFont - El nombre de la nueva tipografía seleccionada.
   */
  const handleFontChange = (index: number, newFont: string) => {
    const newFonts = [...selectedFonts];
    newFonts[index] = newFont;
    setSelectedFonts(newFonts);
  };

  /**
   * Selecciona 12 tipografías aleatorias diferentes de la lista disponible.
   */
  const handleRandomizeFonts = () => {
    const shuffled = [...GOOGLE_FONTS].sort(() => 0.5 - Math.random());
    setSelectedFonts(shuffled.slice(0, 12));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 border-b border-app-primary/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Abejorro Digital</h1>
          <h2 className="text-xl md:text-2xl mt-1 opacity-90">Tipografía</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomizeFonts}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-app-primary/20 transition-colors"
            title="Selección aleatoria"
          >
            <Dices size={20} />
            <span className="hidden sm:inline">Aleatorio</span>
          </button>
          <button
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-app-primary/90 transition-colors"
          >
            <Settings size={20} />
            <span>Configuración</span>
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="phrase-input" className="text-app-legend text-sm uppercase tracking-wider font-semibold">
            Escribe tu frase o palabra
          </label>
          <input
            id="phrase-input"
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Escribe algo aquí..."
            className="w-full bg-transparent border-2 border-app-primary/50 rounded-lg p-4 text-xl md:text-2xl focus:outline-none focus:border-app-primary transition-colors text-app-text"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedFonts.map((font, index) => (
            <FontCard key={`${font}-${index}`} font={font} phrase={phrase} />
          ))}
        </div>
      </main>

      {/* Configuration Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-app-bg border border-app-primary/30 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Configurar Tipografías</h3>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-app-text bg-transparent"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-app-legend mb-6">
              Selecciona las 12 tipografías que deseas visualizar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedFonts.map((selectedFont, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <label className="text-xs text-app-legend uppercase tracking-wider">
                    Muestra {index + 1}
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => handleFontChange(index, e.target.value)}
                    className="bg-black/50 border border-app-primary/30 rounded p-2 text-app-text focus:outline-none focus:border-app-primary"
                  >
                    {GOOGLE_FONTS.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsConfigOpen(false)}
                className="px-6 py-2 rounded-md"
              >
                Guardar y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente que renderiza una tarjeta individual para previsualizar una tipografía.
 * Incluye opciones para descargar la previsualización como imagen PNG y un enlace
 * a la página oficial de Google Fonts.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.font - El nombre de la tipografía de Google Fonts.
 * @param {string} props.phrase - La frase de texto a previsualizar.
 * @returns {JSX.Element} Tarjeta de previsualización de tipografía.
 */
const FontCard: React.FC<{ font: string, phrase: string }> = ({ font, phrase }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  /**
   * Genera y descarga una imagen PNG del contenedor de la frase actual
   * utilizando la librería html-to-image.
   */
  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#121212',
        style: { margin: '0', padding: '24px' }
      });
      const link = document.createElement('a');
      link.download = `tipografia-${font.replace(/ /g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image', err);
    }
  };

  const googleFontsUrl = `https://fonts.google.com/specimen/${font.replace(/ /g, '+')}`;

  return (
    <div className="flex flex-col border border-app-primary/20 rounded-lg overflow-hidden bg-black/20 hover:border-app-primary/50 transition-colors">
      {/* The area to be captured as PNG */}
      <div
        ref={cardRef}
        className="p-6 flex-grow flex items-center justify-center min-h-[150px] overflow-hidden bg-app-bg"
      >
        <p
          style={{ fontFamily: `"${font}", sans-serif` }}
          className="text-3xl md:text-4xl text-center break-words w-full text-app-text"
        >
          {phrase || 'Escribe algo...'}
        </p>
      </div>

      {/* Footer / Controls */}
      <div className="p-4 bg-black/40 border-t border-app-primary/20 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-app-primary">{font}</span>
          <a
            href={googleFontsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 mt-1 w-fit"
          >
            Ver en Google Fonts <ExternalLink size={12} />
          </a>
        </div>

        <button
          onClick={handleDownload}
          title="Descargar como imagen"
          className="p-2 rounded-full hover:bg-app-primary/20 bg-transparent text-app-primary border border-app-primary/50 transition-colors flex-shrink-0"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
}
