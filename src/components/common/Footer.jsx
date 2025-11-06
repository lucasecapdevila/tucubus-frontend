import { faGithub, faLinkedin, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-6 border-t border-gray-300">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row lg:pl-64 justify-between items-center gap-4">
        <div className="flex-1 flex justify-center lg:justify-center">
          <p className="font-light text-center">&copy; 2025 - Sitio desarrollado por Lucas Capdevila</p>
        </div>
        <ul className="flex flex-row items-center gap-3 lg:gap-6 mt-2 lg:mt-0">
          <li>
            <Link to="https://github.com/lucasecapdevila" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600" title="GitHub">
              <FontAwesomeIcon icon={faGithub} size="lg" />
            </Link>
          </li>
          <li>
            <Link to="mailto:lcapdevila60@gmail.com" className="hover:text-gray-600" title="Email">
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
            </Link>
          </li>
          <li>
            <Link to="https://www.linkedin.com/in/lucasecapdevila/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600" title="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </Link>
          </li>
          <li>
            <Link to="https://wa.me/5493865244215" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600" title="Whatsapp">
              <FontAwesomeIcon icon={faWhatsapp} size="lg" />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer