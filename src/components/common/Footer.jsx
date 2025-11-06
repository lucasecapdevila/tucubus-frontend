import { faGithub, faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-6 border-t border-gray-300">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row lg:pl-64 justify-between items-center gap-4">
        <div className="flex-1 flex justify-center lg:justify-center">
          <p className="font-light text-center">&copy; 2025 - Sitio desarrollado por Lucas Capdevila</p>
        </div>
        <ul className="flex flex-row items-center gap-3 lg:gap-6 mt-2 lg:mt-0">
          <li>
            <a href="https://github.com/tuusuario" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600" title="GitHub">
              <FontAwesomeIcon icon={faGithub} size="lg" />
            </a>
          </li>
          <li>
            <a href="mailto:tucorreo@ejemplo.com" className="hover:text-gray-600" title="Email">
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/tuusuario" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600" title="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </a>
          </li>
          <li>
            <a href="https://wa.me/5491123456789" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600" title="Whatsapp">
              <FontAwesomeIcon icon={faWhatsapp} size="lg" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer