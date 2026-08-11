import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "../constants/images";
import {
  handleRegistration,
  handleNewsletterSubscription,
} from "../api/telegram";
import { API_ENDPOINTS } from "../config/api";
import { newsletterData } from "../data/newsletterData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faUsers,
  faCertificate,
  faRocket,
  faChartLine,
  faCode,
  faShieldAlt,
  faQuoteLeft,
  IconDefinition,
  faDatabase,
  faGlobe,
  faCheckCircle,
  faStar,
  faCoins,
  faTrophy,
  faCalendarAlt,
  faExternalLinkAlt,
  faArrowRight,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { faEthereum, faBitcoin } from "@fortawesome/free-brands-svg-icons";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useAnimate,
  useScroll,
  MotionValue,
} from "framer-motion";
import Particles from "react-tsparticles";
import { HACKATHON_INFO, NUM_TRACKS, TRACKS_EN_LINEA } from "../data/hackathonInfo";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import "../styles/global.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Treemap,
  Tooltip as RechartsTooltip,
} from "recharts";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import StatsSection from "../components/StatsSection";
import EventsCarousel from "../components/EventsCarousel";
import { eventosData, eventosLumaPresenciales } from "../data/eventosData";
import { partnersData } from "../data/partnersData";
import { fotosComunidadLanding } from "../data/fotosComunidadLanding";
import { proyectosHacksData } from "../data/proyectosHacksData";
import { cursosData } from "../constants/cursosData";

interface RegistrationForm {
  nombre: string;
  apellidos: string;
  edad: string;
  carrera: string;
  plantel: string;
  numeroCuenta: string;
  motivacion: string;
  telegram: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  facebook: string;
}

// Tipos para los componentes
interface AnimatedNumberProps {
  to: number;
  duration?: number;
  style?: React.CSSProperties;
}

interface TechCardProps {
  icon: IconDefinition;
  title: string;
  description: string;
}

// Componente para animar números
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  to,
  duration = 2,
  style = {},
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  useEffect(() => {
    const controls = animate(count, to, { duration });
    return () => controls.stop();
  }, [to, duration]);
  return <motion.span style={style}>{rounded}</motion.span>;
};

// Componente para tarjetas con efecto de color
const TechCard: React.FC<TechCardProps> = ({ icon, title, description }) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animation = animate(
      scope.current,
      {
        backgroundColor: [
          "rgba(30, 58, 138, 0.1)",
          "rgba(37, 99, 235, 0.1)",
          "rgba(30, 58, 138, 0.1)",
        ],
        borderColor: [
          "rgba(212, 175, 55, 0.2)",
          "rgba(212, 175, 55, 0.4)",
          "rgba(212, 175, 55, 0.2)",
        ],
      },
      {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      },
    );

    return () => animation.cancel();
  }, []);

  return (
    <motion.div
      ref={scope}
      style={{
        background: "rgba(20,20,30,0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
        borderRadius: 12,
        padding: "clamp(0.75rem, 2.5vw, 1.15rem)",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minHeight: 0,
        transition: "all 0.3s ease",
      }}
      whileHover={{ scale: 1.03 }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "rgba(212,175,55,0.15)",
          border: "1px solid rgba(212,175,55,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{ color: "#D4AF37", fontSize: "0.9rem" }}
        />
      </div>
      <h3
        style={{
          color: "#fff",
          fontFamily: "Orbitron",
          fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: "0.78rem",
          lineHeight: 1.45,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
};

// Función para el efecto parallax
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// Componente para secciones con parallax
const ParallaxSection = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: number;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 30);

  return (
    <motion.section
      ref={ref}
      className="parallax-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        style={{ y }}
        className="section-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

// Componente para el contenido del Treemap
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, medianFee, nTx } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`rgba(52, 211, 153, ${0.3 + 0.7 * Math.min(1, medianFee / 100)})`}
        stroke="#2563EB"
        rx={6}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - 8}
        textAnchor="middle"
        fill="#fff"
        fontSize={14}
        fontWeight="bold"
      >
        {name}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 10}
        textAnchor="middle"
        fill="#D4AF37"
        fontSize={12}
      >
        {nTx} txs
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 26}
        textAnchor="middle"
        fill="#34d399"
        fontSize={11}
      >
        Fee mediana: {medianFee} sat/vB
      </text>
    </g>
  );
};

// Componente para el contenido del Treemap tipo goggles
const MempoolGogglesContent = (props: any) => {
  const { x, y, width, height, hash, fee, vsize, feePerVByte } = props;
  // Validación de datos
  if (!x || !y || !width || !height || !vsize || !fee || !hash || !feePerVByte)
    return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getFeeColor(feePerVByte)}
        stroke="#2563EB"
        rx={3}
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
            fontWeight="bold"
          >
            {feePerVByte} sat/vB
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill="#D4AF37"
            fontSize={9}
          >
            {vsize} bytes
          </text>
        </>
      )}
    </g>
  );
};

// Tooltip personalizado para el treemap
const MempoolGogglesTooltip = ({ active, payload }: any) => {
  if (
    active &&
    payload &&
    payload.length &&
    payload[0].payload &&
    typeof payload[0].payload.hash === "string" &&
    typeof payload[0].payload.fee === "number" &&
    typeof payload[0].payload.vsize === "number" &&
    typeof payload[0].payload.feePerVByte === "number"
  ) {
    const tx = payload[0].payload;
    return (
      <div
        style={{
          background: "#18181b",
          border: "1px solid #2563EB",
          borderRadius: 8,
          padding: 10,
          color: "#fff",
          fontSize: 13,
        }}
      >
        <div>
          <b>Hash:</b>{" "}
          <span style={{ fontSize: 11 }}>{tx.hash.slice(0, 12)}...</span>
        </div>
        <div>
          <b>Fee:</b> {tx.fee} sats
        </div>
        <div>
          <b>Tamaño:</b> {tx.vsize} bytes
        </div>
        <div>
          <b>Fee/vByte:</b> {tx.feePerVByte} sat/vB
        </div>
      </div>
    );
  }
  return null;
};

// Función para color según fee/vByte
const getFeeColor = (feePerVByte: number) => {
  if (feePerVByte < 5) return "#34d399"; // verde
  if (feePerVByte < 20) return "#fbbf24"; // amarillo
  return "#ef4444"; // rojo
};

// Generador de transacciones simuladas para el treemap
const generateFakeMempoolTxs = (n = 60) => {
  return Array.from({ length: n }, (_, i) => {
    const vsize = Math.floor(Math.random() * 680) + 120;
    const fee = Math.floor(Math.random() * 19800) + 200;
    return {
      name: `fakehash${i}`,
      size: vsize,
      hash: `fakehash${i}`,
      fee,
      vsize,
      feePerVByte: Math.round(fee / vsize),
    };
  });
};

// Función para formatear números grandes
const formatMarketCap = (value: number) => {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + "T";
  if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
  return value.toString();
};

const NETWORKS: Record<number, { name: string; logo: string }> = {
  1: {
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  },
  5: {
    name: "Goerli",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  },
  11155111: {
    name: "Sepolia",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  },
  137: {
    name: "Polygon",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=026",
  },
  80001: {
    name: "Polygon Mumbai",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=026",
  },
  56: {
    name: "Binance Smart Chain",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026",
  },
  97: {
    name: "BSC Testnet",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026",
  },
  42161: {
    name: "Arbitrum One",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=026",
  },
  10: {
    name: "Optimism",
    logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=026",
  },
  43114: {
    name: "Avalanche C-Chain",
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png?v=026",
  },
};

const getChainId = () => {
  if (
    window &&
    (window as any).ethereum &&
    (window as any).ethereum.networkVersion
  ) {
    return parseInt((window as any).ethereum.networkVersion);
  }
  return undefined;
};

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState<RegistrationForm>({
    nombre: "",
    apellidos: "",
    edad: "",
    carrera: "",
    plantel: "",
    numeroCuenta: "",
    motivacion: "",
    telegram: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    facebook: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false);
  const [showNewsletterError, setShowNewsletterError] = useState(false);
  const [btcHistory, setBtcHistory] = useState<
    { date: string; price: number }[]
  >([]);
  const [marketCap, setMarketCap] = useState<{ date: string; cap: number }[]>(
    [],
  );
  const [hashrate, setHashrate] = useState<{ date: string; value: number }[]>(
    [],
  );
  const [contracts, setContracts] = useState<{ date: string; value: number }[]>(
    [],
  );
  const [mempoolBlocks, setMempoolBlocks] = useState<any[]>([]);
  const [mempoolTxs, setMempoolTxs] = useState<any[]>([]);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [btcDominance, setBtcDominance] = useState<
    { date: string; dominance: number }[]
  >([]);
  const [networkName, setNetworkName] = useState<string>("");
  const [networkLogo, setNetworkLogo] = useState<string>("");
  const [cursosHome, setCursosHome] = useState<any[]>([]);
  const [eventosHome, setEventosHome] = useState<any[]>([]);
  const [newslettersHome, setNewslettersHome] = useState<any[]>([]);
  // Evento próximo destacado: Hackathon UNAM 2026 en la Facultad de Ingeniería
  const hackathonUnamHome = {
    id: "hackathon-unam-home",
    title: "Hackathon UNAM 2026 · Facultad de Ingeniería",
    date: "21 - 24 Septiembre, 2026",
    time: "Semana DIE",
    location: "Facultad de Ingeniería UNAM · CDMX",
    image: "/images/semanadie/sponsorship/hackathon-unamxhacks.png",
    description:
      `${HACKATHON_INFO.horas} horas construyendo con IA, blockchain e impacto social en la Facultad de Ingeniería. ¡Premios y aceleración!`,
    isUpcoming: true,
  };
  // Eventos: primero de eventosData (con imagen), si no hay, solo compufest[1] desde Luma en el carrusel del home
  const eventosLumaHome = eventosLumaPresenciales.filter(
    (e) => e.id === "luma-compufest-1",
  );
  const eventosCarousel = [
    hackathonUnamHome,
    ...(eventosData.filter((e) => e.isUpcoming).length > 0
      ? eventosData.filter((e) => e.isUpcoming).slice(0, 3)
      : eventosLumaHome.map((e) => ({
          id: e.id,
          title: e.title,
          date: "Próximamente",
          time: "",
          location: "Ver evento en Luma",
          image: "/images/LogosCriptounam2.svg",
          description: e.description || "",
          isUpcoming: true,
          lumaEventId: e.lumaEventId,
        }))),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.nombre ||
      !formData.apellidos ||
      !formData.edad ||
      !formData.carrera ||
      !formData.plantel ||
      !formData.numeroCuenta ||
      !formData.motivacion
    ) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return;
    }

    try {
      // Asegurarnos de que todos los campos estén presentes
      const registrationData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        edad: formData.edad,
        carrera: formData.carrera,
        plantel: formData.plantel,
        numeroCuenta: formData.numeroCuenta,
        motivacion: formData.motivacion,
        telegram: formData.telegram || "No proporcionado",
        twitter: formData.twitter || "No proporcionado",
        instagram: formData.instagram || "No proporcionado",
        linkedin: formData.linkedin || "No proporcionado",
        facebook: formData.facebook || "No proporcionado",
      };

      console.log("Enviando datos:", registrationData); // Para debugging

      const result = await handleRegistration(registrationData);

      if (result.success) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowForm(false);
          setFormData({
            nombre: "",
            apellidos: "",
            edad: "",
            carrera: "",
            plantel: "",
            numeroCuenta: "",
            motivacion: "",
            telegram: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            facebook: "",
          });
        }, 700);

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        console.error("Error en la respuesta:", result.message);
        setShowErrorMessage(true);
        setTimeout(() => {
          setShowErrorMessage(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setShowNewsletterError(true);
      setTimeout(() => setShowNewsletterError(false), 5000);
      return;
    }

    try {
      // Enviar notificación a Telegram
      await handleNewsletterSubscription(email, "home");

      setEmail("");
      setShowNewsletterSuccess(true);
      setTimeout(() => setShowNewsletterSuccess(false), 5000);
    } catch (error) {
      setShowNewsletterError(true);
      setTimeout(() => setShowNewsletterError(false), 5000);
    }
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    particles: {
      number: { value: 120, density: { enable: true, value_area: 400 } },
      color: { value: ["#D4AF37", "#1E3A8A", "#2563EB"] },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 4,
        direction: "none" as const,
        random: true,
        straight: false,
        outModes: { default: "out" as const },
      },
      links: {
        enable: true,
        distance: 100,
        color: "#D4AF37",
        opacity: 0.4,
        width: 1,
      },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" } },
      modes: {
        repulse: { distance: 120, duration: 0.4 },
        grab: { distance: 120, links: { opacity: 0.8 } },
        parallax: { enable: true, force: 60, smooth: 20 },
      },
      detect_on: "window" as const,
    },
    background: { color: { value: "transparent" } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Carrusel de testimonios
  const testimonios = [
    {
      quote:
        "CriptoUNAM me abrió las puertas al mundo de blockchain. Ahora trabajo en un proyecto DeFi.",
      name: "María González",
      role: "Desarrolladora Blockchain",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      quote:
        "La comunidad y los recursos de CriptoUNAM son increíbles. Aprendí más de lo que esperaba.",
      name: "Carlos Rodríguez",
      role: "Analista de Criptomonedas",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote: "Gracias a CriptoUNAM conseguí mi primer trabajo en Web3.",
      name: "Ana Torres",
      role: "Smart Contract Engineer",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  // Fetch histórico de BTC y market cap - Comentado por CORS
  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    const sampleData = [
      { date: "Ene 1", price: 45000 },
      { date: "Ene 15", price: 47000 },
      { date: "Feb 1", price: 46000 },
      { date: "Feb 15", price: 48000 },
      { date: "Mar 1", price: 50000 },
    ];
    setBtcHistory(sampleData);
    setMarketCap(
      sampleData.map((d) => ({ date: d.date, cap: d.price * 1000000 })),
    );
  }, []);

  // Fetch hashrate histórico - Comentado por CORS
  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    const sampleHashrate = [
      { date: "Ene 1", value: 450000000000000 },
      { date: "Ene 15", value: 460000000000000 },
      { date: "Feb 1", value: 470000000000000 },
      { date: "Feb 15", value: 480000000000000 },
      { date: "Mar 1", value: 490000000000000 },
    ];
    setHashrate(sampleHashrate);
  }, []);

  // Fetch contratos inteligentes Ethereum (simulado)
  useEffect(() => {
    // Simulación de datos: crecimiento lineal
    const base = 3000000;
    const arr = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(
        Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("es-MX", { month: "short", day: "numeric" }),
      value: base + i * 12000 + Math.floor(Math.random() * 5000),
    }));
    setContracts(arr);
  }, []);

  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    setMempoolBlocks([]);
  }, []);

  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    setMempoolTxs([]);
  }, []);

  // Fetch dominancia de BTC - Comentado por CORS
  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    const sampleDominance = [
      { date: "Ene 1", dominance: 42.5 },
      { date: "Ene 15", dominance: 43.2 },
      { date: "Feb 1", dominance: 41.8 },
      { date: "Feb 15", dominance: 44.1 },
      { date: "Mar 1", dominance: 43.7 },
    ];
    setBtcDominance(sampleDominance);
  }, []);

  useEffect(() => {
    const updateNetwork = () => {
      const chainId = getChainId();
      if (chainId && NETWORKS[chainId]) {
        setNetworkName(NETWORKS[chainId].name);
        setNetworkLogo(NETWORKS[chainId].logo);
      } else if (chainId) {
        setNetworkName(`Chain ID: ${chainId}`);
        setNetworkLogo("");
      } else {
        setNetworkName("Desconocida");
        setNetworkLogo("");
      }
    };
    updateNetwork();
    if (window && (window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", updateNetwork);
      return () => {
        (window as any).ethereum.removeListener("chainChanged", updateNetwork);
      };
    }
  }, []);

  // Ejemplo de cursos y eventos destacados (puedes reemplazar con fetch real)
  const cursosDestacados = [
    {
      titulo: "Introducción a Blockchain",
      descripcion:
        "Aprende los fundamentos de la tecnología blockchain y sus aplicaciones.",
      imagen: IMAGES.CURSOS?.BLOCKCHAIN_BASICS,
      link: "/cursos",
    },
    {
      titulo: "Smart Contracts con Solidity",
      descripcion: "Desarrolla contratos inteligentes en la red Ethereum.",
      imagen: IMAGES.CURSOS?.SMART_CONTRACTS,
      link: "/cursos",
    },
  ];
  const eventosProximos = [
    {
      titulo: "Stellar DEFI",
      fecha: "28 Mayo 2025",
      lugar: "Facultad de Economia",
      imagen: IMAGES.CURSOS?.BLOCKCHAIN_BASICS,
      link: "/eventos",
    },
  ];

  // Proyectos destacados
  const projects = [
    {
      title: "Utonoma",
      description:
        "Plataforma de videos descentralizada construida con Solidity para la distribución de contenido educativo.",
      image: "/images/Proyectos/Utonoma.png",
      category: "hackathon" as const,
      prize: "Proyecto Destacado - Hackathon Blockchain 2024",
      team: ["Equipo CriptoUNAM"],
      technologies: ["Solidity", "React", "Web3.js", "IPFS"],
      link: "#",
      github: "#",
    },
    {
      title: "CU-Shop",
      description:
        "Marketplace sobre blockchain para estudiantes universitarios construido en Base con Solidity.",
      image: "/images/Proyectos/CU-Shop.png",
      category: "community" as const,
      team: ["Equipo CriptoUNAM"],
      technologies: ["Base", "Solidity", "React", "Web3.js"],
      link: "#",
      github: "#",
    },
    {
      title: "La Kiniela",
      description:
        "Mercado de predicciones mexicano construido en Arbitrum con Solidity para apuestas deportivas.",
      image: "/images/Proyectos/LaKiniela.png",
      category: "hackathon" as const,
      prize: "Proyecto Innovador - Hackathon DeFi 2024",
      team: ["Equipo CriptoUNAM"],
      technologies: ["Arbitrum", "Solidity", "React", "Chainlink"],
      link: "#",
      github: "#",
    },
    {
      title: "PumaPay",
      description:
        "Wallet universitaria para pagos diarios en cafeterías usando MXNB, Bitso y Juno.",
      image: "/images/Proyectos/PumaPay.png",
      category: "community" as const,
      team: ["Equipo CriptoUNAM"],
      technologies: ["MXNB", "Bitso", "Juno", "React Native"],
      link: "#",
      github: "#",
    },
    {
      title: "My DentalVault",
      description:
        "Sistema de registro dental de tratamientos e historia médica construido en Polkadot.",
      image: "/images/Proyectos/MyDentalVault.png",
      category: "research" as const,
      team: ["Equipo CriptoUNAM"],
      technologies: ["Polkadot", "Substrate", "React", "IPFS"],
      link: "#",
      github: "#",
    },
    {
      title: "UniFood",
      description:
        "Sistema de distribución de becas para alimentación construido en ZKsync.",
      image: "/images/Proyectos/UniFood.png",
      category: "community" as const,
      team: ["Equipo CriptoUNAM"],
      technologies: ["ZKsync", "Solidity", "React", "Zero-Knowledge"],
      link: "#",
      github: "#",
    },
    {
      title: "LatamCoins",
      description:
        "Indizador de monedas latinoamericanas construido en Solana para el mercado regional.",
      image: "/images/Proyectos/LatamCoins.png",
      category: "hackathon" as const,
      prize: "Mejor Proyecto Regional - Hackathon Latam 2024",
      team: ["Equipo CriptoUNAM"],
      technologies: ["Solana", "Rust", "React", "Anchor"],
      link: "#",
      github: "#",
    },
    {
      title: "SkillHubID",
      description:
        "Sistema de certificación a través de la comunidad construido en Stellar.",
      image: "/images/Proyectos/SkillHubID.png",
      category: "community" as const,
      team: ["Equipo CriptoUNAM"],
      technologies: ["Stellar", "JavaScript", "React", "Soroswap"],
      link: "#",
      github: "#",
    },
    {
      title: "ZenTrade",
      description:
        "Plataforma de trading descentralizada construida en Stellar para el mercado latinoamericano.",
      image: "/images/Proyectos/ZenTrade.png",
      category: "hackathon" as const,
      team: ["Equipo CriptoUNAM"],
      technologies: ["Stellar", "JavaScript", "React", "Soroswap"],
      link: "#",
      github: "#",
    },
    {
      title: "PumaAgentAI",
      description:
        "Agente de inteligencia artificial para asistencia estudiantil y gestión universitaria.",
      image: "/images/Proyectos/PumaAgentAI.png",
      category: "research" as const,
      team: ["Equipo CriptoUNAM"],
      technologies: ["AI", "Machine Learning", "Python", "OpenAI"],
      link: "#",
      github: "#",
    },
    {
      title: "CoreWeavesAgent",
      description:
        "TokenLauncher sobre CoreDAO para la creación y gestión de tokens comunitarios.",
      image: "/images/Proyectos/CoreWeavesAgent.png",
      category: "hackathon" as const,
      prize: "Proyecto Destacado - CoreDAO Hackathon 2024",
      team: ["Equipo CriptoUNAM"],
      technologies: ["CoreDAO", "Solidity", "React", "Web3.js"],
      link: "#",
      github: "#",
    },
    {
      title: "Mundial-Buzz",
      description:
        "Sistema de apuestas para el mundial 2026 desarrollado en EthGlobal NYC.",
      image: "/images/Proyectos/MundialBuzz.png",
      category: "hackathon" as const,
      prize: "EthGlobal NYC 2024",
      team: ["Equipo CriptoUNAM"],
      technologies: ["Ethereum", "Solidity", "React", "The Graph"],
      link: "#",
      github: "#",
    },
  ];

  // Estadísticas
  const stats = [
    {
      icon: faUsers,
      value: "500+",
      label: "Miembros Activos",
      description: "Estudiantes y profesionales en blockchain",
      color: "#34D399",
    },
    {
      icon: faGraduationCap,
      value: "25+",
      label: "Workshops Realizados",
      description: "Talleres especializados en blockchain",
      color: "#3B82F6",
    },
    {
      icon: faTrophy,
      value: "10+",
      label: "Hackathones Ganados",
      description: "Competencias y premios obtenidos",
      color: "#F59E0B",
    },
    {
      icon: faCode,
      value: "30+",
      label: "Proyectos Realizados",
      description: "Aplicaciones y protocolos blockchain",
      color: "#8B5CF6",
    },
  ];

  useEffect(() => {
    const fetchCursosYEventos = async () => {
      try {
        // Temporalmente deshabilitado para evitar errores de CORS
        // const cursosRes = await axios.get<any[]>(API_ENDPOINTS.CURSOS);
        // setCursosHome(Array.isArray(cursosRes.data) ? cursosRes.data.slice(0, 4) : []);
        // const eventosRes = await axios.get<any[]>(API_ENDPOINTS.EVENTOS);
        // setEventosHome(Array.isArray(eventosRes.data) ? eventosRes.data.filter((e:any)=>e.tipo==='proximo').slice(0, 4) : []);

        // Datos de ejemplo para evitar errores
        setCursosHome([]);
        setEventosHome([]);
      } catch (e) {
        setCursosHome([]);
        setEventosHome([]);
      }
    };

    const fetchNewsletters = () => {
      // Ordenar por fecha (más recientes primero) y tomar las 3 primeras
      const MESES_ES: Record<string, number> = {
        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11,
      };
      const parseFecha = (dateStr: string): number => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
          return new Date(dateStr).getTime();
        const match = dateStr.match(/(\d{1,2})\s+de\s+(\w+),?\s+(\d{4})/i);
        if (match) {
          const month = MESES_ES[match[2].toLowerCase()];
          if (month !== undefined)
            return new Date(
              parseInt(match[3]),
              month,
              parseInt(match[1]),
            ).getTime();
        }
        return 0;
      };
      const ordenadas = [...newsletterData].sort(
        (a, b) => parseFecha(b.fecha) - parseFecha(a.fecha),
      );
      setNewslettersHome(ordenadas);
    };

    fetchCursosYEventos();
    fetchNewsletters();
  }, []);

  return (
    <div className="home-page">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="particles-container"
      />

      {/* Hero principal — card glass con glow */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(3rem, 10vw, 5rem) 1rem 1.5rem",
          position: "relative",
        }}
      >
        {/* Glow ambiental detrás de la card */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(720px, 92%)",
            height: "100%",
            background:
              "radial-gradient(closest-side, rgba(212,175,55,0.18), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          className="hero-card"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 640,
            background:
              "linear-gradient(160deg, rgba(20,20,30,0.85) 0%, rgba(10,10,18,0.92) 100%)",
            border: "1.5px solid rgba(212,175,55,0.35)",
            borderRadius: 24,
            padding:
              "clamp(2.2rem, 6vw, 3rem) clamp(1.25rem, 5vw, 2.5rem) clamp(1.5rem, 4vw, 2rem)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 60px rgba(212,175,55,0.12)",
            textAlign: "center",
            overflow: "visible",
          }}
        >
          {/* Logo con halo, sobresale del top */}
          <div
            style={{
              position: "absolute",
              top: "clamp(-65px, -10vw, -55px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "clamp(120px, 28vw, 150px)",
              height: "clamp(120px, 28vw, 150px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 25%, #fff7d6 0%, #F4D03F 35%, #D4AF37 70%, #8b6e1d 100%)",
              padding: 3,
              boxShadow:
                "0 14px 40px rgba(212,175,55,0.5), 0 0 0 6px rgba(212,175,55,0.1)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={IMAGES?.LOGO}
                alt="CriptoUNAM"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* Badge sutil arriba */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: "clamp(65px, 14vw, 85px)",
              marginBottom: "0.85rem",
              padding: "4px 12px",
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: 999,
              fontSize: "clamp(0.7rem, 1.9vw, 0.78rem)",
              color: "#F4D03F",
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 8px #4ade80",
                animation: "hero-pulse 2s ease-in-out infinite",
              }}
            />
            Comunidad Web3 · UNAM
          </div>

          <h1
            style={{
              fontFamily: "Orbitron",
              fontSize: "clamp(1.7rem, 6.5vw, 2.7rem)",
              margin: "0 0 0.85rem",
              lineHeight: 1.1,
              background:
                "linear-gradient(135deg, #fff7d6 0%, #F4D03F 50%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 4px 24px rgba(212,175,55,0.3))",
              letterSpacing: "-0.01em",
            }}
          >
            Bienvenido a<br />
            <span style={{ fontSize: "1.1em" }}>CriptoUNAM</span>
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "clamp(0.88rem, 2.4vw, 1rem)",
              margin: "0 auto 1.5rem",
              maxWidth: 480,
              lineHeight: 1.6,
            }}
          >
            La comunidad universitaria líder en blockchain y Web3 en México.
            Formamos la próxima generación de constructores descentralizados.
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.55rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <Link
              to="/cursos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "clamp(0.88rem, 2.3vw, 1rem)",
                fontWeight: 700,
                borderRadius: 12,
                padding: "0.7rem 1.4rem",
                background:
                  "linear-gradient(135deg, #F4D03F 0%, #D4AF37 60%, #b8962e 100%)",
                color: "#0a0a0a",
                textDecoration: "none",
                border: "none",
                boxShadow: "0 10px 28px rgba(212,175,55,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 14px 34px rgba(212,175,55,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 28px rgba(212,175,55,0.4)";
              }}
            >
              Explora los cursos
            </Link>
            <Link
              to="/eventos#comunidad"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "clamp(0.88rem, 2.3vw, 1rem)",
                fontWeight: 600,
                borderRadius: 12,
                padding: "0.7rem 1.4rem",
                background: "rgba(37,99,235,0.15)",
                color: "#bfdbfe",
                textDecoration: "none",
                border: "1px solid rgba(37,99,235,0.5)",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(37,99,235,0.28)";
                e.currentTarget.style.borderColor = "rgba(37,99,235,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(37,99,235,0.15)";
                e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)";
              }}
            >
              Únete a la comunidad
            </Link>
          </div>

          <Link
            to="/newsletter"
            style={{
              display: "inline-block",
              color: "#94a3b8",
              fontSize: "0.78rem",
              textDecoration: "none",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "0.75rem",
              marginTop: "0.25rem",
              width: "100%",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F4D03F")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            📬 Newsletter — ediciones y archivo
          </Link>
        </div>

        <style>{`
          @keyframes hero-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.3); }
          }
        `}</style>
      </section>
      {/* Banner Token $PUMA */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto 3rem auto",
          padding: "0 1.5rem",
        }}
      >
        <div
          className="puma-card puma-card--featured puma-card--shimmer puma-fade-in-up"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1.5rem",
            padding: "1.2rem 1.5rem",
            background:
              "linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(30,30,30,0.9) 100%)",
            border: "1px solid rgba(212,175,55,0.3)",
            boxShadow: "0 4px 20px rgba(212,175,55,0.08)",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              flex: "0 0 90px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
                    src="/images/puma-token-v2.png"
              alt="Token $PUMA"
              style={{
                width: "100%",
                maxWidth: "90px",
                height: "auto",
                filter: "drop-shadow(0 0 15px rgba(212,175,55,0.4))",
                animation: "float 6s ease-in-out infinite",
                objectFit: "contain",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.4rem",
              }}
            >
              <span
                className="puma-chip puma-chip--gold"
                style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem" }}
              >
                <FontAwesomeIcon icon={faStar} /> NUEVO
              </span>
              <h2
                style={{
                  fontFamily: "Orbitron",
                  color: "#F4D03F",
                  fontSize: "1.3rem",
                  margin: 0,
                }}
              >
                Token $PUMA
              </h2>
            </div>
            <p
              style={{
                color: "#cbd5e1",
                lineHeight: 1.4,
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              El token exclusivo de CriptoUNAM. Gana $PUMA en misiones y úsalo
              para <strong>comprar cursos premium</strong> y acceder a{" "}
              <strong>eventos exclusivos</strong>.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <Link
              to="/recompensas"
              className="puma-btn puma-btn--gold"
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              <FontAwesomeIcon icon={faCoins} />
              Recompensas
            </Link>
            <Link
              to="/cursos"
              className="puma-btn puma-btn--outline"
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              <FontAwesomeIcon icon={faGraduationCap} />
              Cursos
            </Link>
          </div>
        </div>
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
          @media (max-width: 768px) {
            .puma-card--featured {
              flex-direction: column !important;
              text-align: center;
              padding: 1.5rem !important;
            }
            .puma-card--featured > div:first-child {
              margin-bottom: 0.5rem;
            }
            .puma-card--featured > div:last-child {
              width: 100%;
              justify-content: center !important;
              margin-top: 1rem;
            }
            .puma-card--featured .puma-btn {
              flex: 1;
              justify-content: center;
            }
          }
        `}</style>
      </section>

      {/* Banner Hackathon CriptoUNAM - Facultad de Ingeniería */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 3.5rem auto",
          padding: "0 1.5rem",
        }}
      >
        <div
          className="puma-card puma-card--shimmer puma-fade-in-up"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(2rem, 5vw, 3rem)",
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%)",
            border: "1.5px solid rgba(167, 139, 250, 0.4)",
            boxShadow: "0 12px 40px rgba(167, 139, 250, 0.15)",
            borderRadius: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          {/* Columna Izquierda: Texto y CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
              <span className="puma-chip" style={{ background: "rgba(167, 139, 250, 0.2)", color: "#c4b5fd", border: "1px solid rgba(167, 139, 250, 0.4)", padding: "0.4rem 0.85rem", fontWeight: 700 }}>
                🚀 INSCRIPCIONES ABIERTAS · SEMANA DIE
              </span>
              <span className="puma-chip puma-chip--gold" style={{ padding: "0.4rem 0.85rem", fontWeight: 700 }}>
                📍 FACULTAD DE INGENIERÍA UNAM
              </span>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.75rem" }}>
                <img src="/images/semanadie/escudofi_azul-modified.png" alt="FI UNAM" style={{ height: 42, objectFit: "contain" }} />
                <img src="/images/semanadie/LogoSemanaDIE.png" alt="Semana DIE" style={{ height: 32, objectFit: "contain" }} />
              </div>
              <h2
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)",
                  color: "#fff",
                  margin: "0 0 0.75rem 0",
                  lineHeight: 1.15,
                }}
              >
                Hackathon <span style={{ color: "#F4D03F" }}>UNAM 2026</span>
              </h2>
              <p
                style={{
                  color: "#e2e8f0",
                  fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Organizado por <strong>CriptoUNAM</strong> y la <strong>Facultad de Ingeniería</strong>. Vive {HACKATHON_INFO.horas} horas intensivas de innovación desarrollando tecnología en {NUM_TRACKS} tracks: <strong style={{ color: "#c4b5fd" }}>{TRACKS_EN_LINEA}</strong>.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.5rem" }}>
              <Link
                to="/hackathon"
                className="puma-btn puma-btn--gold"
                style={{
                  fontSize: "1.05rem",
                  padding: "0.85rem 1.8rem",
                  textDecoration: "none",
                }}
              >
                Conoce el Hackathon →
              </Link>
              <Link
                to="/hackathon/guia"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  padding: "0.85rem 1.2rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.2s ease",
                }}
              >
                Guía del Hacker
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Foto de la Sede (Facultad de Ingeniería) */}
          <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(212,175,55,0.3)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", minHeight: "260px" }}>
            <img
              src="/images/semanadie/sponsorship/facultad-ingenieria-aereo.jpg"
              alt="Facultad de Ingeniería UNAM - Sede Hackathon"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "260px" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem", background: "linear-gradient(to top, rgba(10,10,15,0.95), transparent)", color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
              Sede Presencial: Facultad de Ingeniería UNAM · CDMX
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Eventos */}
      {eventosCarousel.length > 0 && (
        <section
          style={{
            maxWidth: "1400px",
            width: "95%",
            margin: "0 auto 3rem auto",
            padding: "0 20px",
          }}
        >
          <EventsCarousel
            events={eventosCarousel}
            autoPlay={true}
            autoPlayInterval={6000}
            showIndicators={true}
            showNavigation={true}
          />
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link
              to="/eventos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "linear-gradient(45deg, #D4AF37, #b8962e)",
                color: "#0A0A0A",
                padding: "0.6rem 1.1rem",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.88rem",
              }}
            >
              Ver todos los eventos
              <FontAwesomeIcon
                icon={faCalendarAlt}
                style={{ fontSize: "0.78rem" }}
              />
            </Link>
          </div>
        </section>
      )}

      {/* ¿Por qué CriptoUNAM? */}
      <section
        style={{
          background: "rgba(26,26,26,0.7)",
          borderRadius: 14,
          maxWidth: 900,
          margin: "0 auto 2rem auto",
          padding: "clamp(1rem, 3vw, 1.5rem)",
          boxShadow: "0 4px 24px #1E3A8A22",
        }}
      >
        <h2
          style={{
            fontFamily: "Orbitron",
            color: "#D4AF37",
            fontSize: "clamp(1.15rem, 3.2vw, 1.5rem)",
            marginTop: 0,
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          ¿Por qué CriptoUNAM?
        </h2>
        <div className="por-que-grid">
          <TechCard
            icon={faUsers}
            title="+500 Miembros"
            description="Comunidad activa de estudiantes y entusiastas."
          />
          <TechCard
            icon={faGraduationCap}
            title="Cursos Gratuitos"
            description="Blockchain, DeFi, NFTs y más, sin costo."
          />
          <TechCard
            icon={faCertificate}
            title="Certificados NFT"
            description="Credenciales digitales únicas por tu aprendizaje."
          />
          <TechCard
            icon={faRocket}
            title="Eventos y Talleres"
            description="Participa en hackathons y talleres exclusivos."
          />
        </div>
        <style>{`
          .por-que-grid {
            display: grid;
            gap: 0.65rem;
            grid-template-columns: repeat(4, 1fr);
          }
          @media (max-width: 720px) {
            .por-que-grid { grid-template-columns: repeat(2, 1fr); }
          }
        `}</style>
      </section>

      {/* Fotos de nuestra comunidad - 3 marquees auto-deslizantes */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto 3rem auto",
          padding: "0 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "Orbitron",
              color: "#D4AF37",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              marginBottom: "0.5rem",
            }}
          >
            Nuestra comunidad
          </h2>
          <p
            style={{
              color: "#E0E0E0",
              fontSize: "1.05rem",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Momentos de eventos, talleres y hackathones en 2025
          </p>
        </div>
        {(() => {
          const total = fotosComunidadLanding.length;
          const perRow = Math.ceil(total / 3);
          const rows = [
            fotosComunidadLanding.slice(0, perRow),
            fotosComunidadLanding.slice(perRow, perRow * 2),
            fotosComunidadLanding.slice(perRow * 2),
          ].filter((r) => r.length > 0);
          return rows.map((row, rowIdx) => (
            <div key={rowIdx} className="fotos-marquee-viewport">
              <div
                className={`fotos-marquee-track fotos-marquee-track--${rowIdx}`}
              >
                {/* duplicado para loop infinito sin salto */}
                {[...row, ...row].map((foto, i) => (
                  <div className="fotos-marquee-card" key={`${rowIdx}-${i}`}>
                    <img
                      src={foto.src}
                      alt={foto.alt}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ));
        })()}
        <style>{`
          .fotos-marquee-viewport {
            overflow: hidden;
            margin-bottom: 0.85rem;
            -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
            mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
          }
          .fotos-marquee-track {
            display: flex;
            gap: 0.75rem;
            width: max-content;
            will-change: transform;
          }
          .fotos-marquee-track--0 { animation: marquee-left 50s linear infinite; }
          .fotos-marquee-track--1 { animation: marquee-right 65s linear infinite; }
          .fotos-marquee-track--2 { animation: marquee-left 42s linear infinite; }
          .fotos-marquee-viewport:hover .fotos-marquee-track {
            animation-play-state: paused;
          }
          @keyframes marquee-left {
            from { transform: translateX(0); }
            to   { transform: translateX(calc(-50% - 0.375rem)); }
          }
          @keyframes marquee-right {
            from { transform: translateX(calc(-50% - 0.375rem)); }
            to   { transform: translateX(0); }
          }
          .fotos-marquee-card {
            flex: 0 0 clamp(140px, 30vw, 200px);
            aspect-ratio: 4 / 3;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(212,175,55,0.2);
            background: rgba(26,26,26,0.6);
          }
          .fotos-marquee-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.4s ease;
          }
          .fotos-marquee-card:hover img {
            transform: scale(1.05);
          }
          @media (prefers-reduced-motion: reduce) {
            .fotos-marquee-track--0,
            .fotos-marquee-track--1,
            .fotos-marquee-track--2 {
              animation: none;
            }
          }
        `}</style>
      </section>

      {/* Estadísticas */}
      <StatsSection
        title="Nuestros Logros"
        description="Cifras que demuestran el impacto y crecimiento de nuestra comunidad"
        stats={stats}
      />

      {/* ============================================================
          STARTUPS — proyectos nacidos en hackathons, en desarrollo
          ============================================================ */}
      {proyectosHacksData.length > 0 && (
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto 3rem",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #4ade80, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 22px rgba(34,197,94,0.4)",
                flexShrink: 0,
              }}
            >
              <FontAwesomeIcon
                icon={faSeedling}
                style={{ color: "#fff", fontSize: "1.1rem" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontFamily: "Orbitron",
                  color: "#fff",
                  fontSize: "clamp(1.25rem, 3.5vw, 1.7rem)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Startups de la comunidad
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "clamp(0.85rem, 2.2vw, 0.95rem)",
                  margin: "0.25rem 0 0",
                }}
              >
                Proyectos nacidos en hackathones que hoy están en desarrollo
                activo.
              </p>
            </div>
            {proyectosHacksData.length > 1 && (
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "#94a3b8",
                  padding: "4px 10px",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                }}
              >
                ← desliza →
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.85rem",
              overflowX: "auto",
              overflowY: "hidden",
              scrollSnapType: "x mandatory",
              paddingBottom: "0.5rem",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(34,197,94,0.4) rgba(255,255,255,0.04)",
            }}
            className="startups-carousel"
          >
            {proyectosHacksData.map((p) => (
              <article
                key={p.id}
                style={{
                  flex: "0 0 clamp(240px, 78vw, 280px)",
                  scrollSnapAlign: "start",
                  background: "rgba(20,20,30,0.8)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    aspectRatio: "16 / 10",
                    background: "linear-gradient(135deg, #0a0a0a, #1a1a25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    loading="lazy"
                    style={{
                      maxWidth: "85%",
                      maxHeight: "85%",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: "0.9rem 1rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Orbitron",
                        color: "#fff",
                        fontSize: "1rem",
                        margin: 0,
                        flex: 1,
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.nombre}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#86efac",
                        padding: "2px 8px",
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        borderRadius: 999,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.red}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#cbd5e1",
                      fontSize: "0.82rem",
                      lineHeight: 1.5,
                      margin: "0 0 0.85rem",
                      flex: 1,
                    }}
                  >
                    {p.descripcion}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "0.45rem 0.75rem",
                          background:
                            "linear-gradient(90deg, #4ade80, #22c55e)",
                          color: "#052e16",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textDecoration: "none",
                          borderRadius: 8,
                        }}
                      >
                        Demo
                        <FontAwesomeIcon
                          icon={faExternalLinkAlt}
                          style={{ fontSize: "0.65rem" }}
                        />
                      </a>
                    )}
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "0.45rem 0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          color: "#cbd5e1",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        Código
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link
              to="/proyectos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#86efac",
                fontSize: "0.88rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Ver todos los proyectos
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ fontSize: "0.7rem" }}
              />
            </Link>
          </div>

          <style>{`
            .startups-carousel::-webkit-scrollbar { height: 6px; }
            .startups-carousel::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 4px; }
            .startups-carousel::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.4); border-radius: 4px; }
            .startups-carousel::-webkit-scrollbar-thumb:hover { background: rgba(34,197,94,0.6); }
          `}</style>
        </section>
      )}

      {/* Últimas Newsletters — ticker horizontal */}
      {newslettersHome.length > 0 && (
        <section
          style={{
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto 3rem auto",
            padding: "0 20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              padding: "0 0.25rem",
              flexWrap: "wrap",
              maxWidth: "1200px",
              margin: "0 auto 1.5rem auto",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "Orbitron",
                  color: "#D4AF37",
                  fontSize: "clamp(1.25rem, 3.5vw, 1.7rem)",
                  margin: "0 0 0.25rem",
                  lineHeight: 1.15,
                }}
              >
                Últimas Noticias
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "clamp(0.85rem, 2.2vw, 0.95rem)",
                  margin: 0,
                }}
              >
                Newsletters frescas de la comunidad.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                to="/newsletter"
                style={{
                  color: "#D4AF37",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                Ver todas
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ fontSize: "0.7rem" }}
                />
              </Link>
            </div>
          </div>

          <div className="newsletter-ticker-container">
            <div className="newsletter-ticker-track">
              {[...newslettersHome, ...newslettersHome].map(
                (newsletter, index) => (
                  <Link
                    key={`${newsletter.id}-${index}`}
                    to={`/newsletter/${newsletter.id}`}
                    className="newsletter-ticker-item"
                  >
                    {newsletter.imagen && (
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 9",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={newsletter.imagen}
                          alt={newsletter.titulo}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        padding: "0.95rem 1rem 1.1rem",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.72rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          marginBottom: 6,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          style={{ color: "#2563EB", fontSize: "0.7rem" }}
                        />
                        {(() => {
                          const dateStr = newsletter.fecha;
                          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                            return new Date(dateStr).toLocaleDateString(
                              "es-MX",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            );
                          }
                          return dateStr;
                        })()}
                      </span>
                      <h3
                        style={{
                          fontFamily: "Orbitron",
                          color: "#F4D03F",
                          fontSize: "1rem",
                          margin: "0 0 0.5rem",
                          lineHeight: 1.25,
                        }}
                      >
                        {newsletter.titulo}
                      </h3>
                      <p
                        style={{
                          color: "#cbd5e1",
                          fontSize: "0.82rem",
                          lineHeight: 1.5,
                          margin: "0 0 0.85rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          flex: 1,
                        }}
                      >
                        {newsletter.contenido}
                      </p>
                      <span
                        style={{
                          color: "#D4AF37",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        Leer más
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          style={{ fontSize: "0.68rem" }}
                        />
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>

          <style>{`
            .newsletter-ticker-container {
              width: 100%;
              overflow: hidden;
              position: relative;
              padding: 0.5rem 0;
              -webkit-mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
              mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
            }
            .newsletter-ticker-track {
              display: flex;
              gap: 1.25rem;
              width: max-content;
              animation: newsletter-ticker 40s linear infinite;
              will-change: transform;
            }
            .newsletter-ticker-container:hover .newsletter-ticker-track {
              animation-play-state: paused;
            }
            .newsletter-ticker-item {
              flex: 0 0 clamp(280px, 30vw, 320px);
              background: rgba(20,20,30,0.85);
              border: 1px solid rgba(212,175,55,0.2);
              border-radius: 14px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              text-decoration: none;
              color: inherit;
              transition: border-color 0.2s, transform 0.2s;
            }
            .newsletter-ticker-item:hover {
              border-color: #D4AF37;
              transform: translateY(-3px);
            }
            @keyframes newsletter-ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - 0.625rem)); }
            }
            @media (prefers-reduced-motion: reduce) {
              .newsletter-ticker-track {
                animation: none;
              }
              .newsletter-ticker-container {
                overflow-x: auto;
                -webkit-mask-image: none;
                mask-image: none;
              }
            }
          `}</style>
        </section>
      )}

      {/* Cursos destacados reales */}
      {cursosHome.length > 0 && (
        <section
          className="section"
          style={{ maxWidth: 1200, margin: "0 auto 2.5rem auto" }}
        >
          <h2
            className="hero-title"
            style={{
              fontFamily: "Orbitron",
              color: "#D4AF37",
              fontSize: "1.5rem",
              marginBottom: "1.2rem",
            }}
          >
            Cursos Destacados
          </h2>
          <div className="grid-4" style={{ gap: "2rem" }}>
            {cursosHome.map((curso, idx) => (
              <div
                key={curso._id || idx}
                className="card"
                style={{
                  textAlign: "center",
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={curso.imagen}
                  alt={curso.titulo}
                  style={{
                    width: "100%",
                    maxWidth: 180,
                    margin: "0 auto 1rem auto",
                    borderRadius: 12,
                    boxShadow: "0 2px 12px #1E3A8A33",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "Orbitron",
                    color: "#D4AF37",
                    fontSize: "1.1rem",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {curso.titulo}
                </h3>
                <p
                  style={{
                    color: "#E0E0E0",
                    fontSize: "1rem",
                    marginBottom: 12,
                  }}
                >
                  {curso.descripcion}
                </p>
                <Link
                  to={`/registro-curso/${curso._id}`}
                  className="primary-button"
                  style={{
                    fontSize: "1rem",
                    borderRadius: 16,
                    padding: "0.5rem 1.2rem",
                  }}
                >
                  Ver curso
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Próximos eventos reales */}
      {eventosHome.length > 0 && (
        <section
          className="section"
          style={{ maxWidth: 1200, margin: "0 auto 2.5rem auto" }}
        >
          <h2
            className="hero-title"
            style={{
              fontFamily: "Orbitron",
              color: "#D4AF37",
              fontSize: "1.5rem",
              marginBottom: "1.2rem",
            }}
          >
            Eventos
          </h2>
          <div className="grid-4" style={{ gap: "2rem" }}>
            {eventosHome.map((evento, idx) => (
              <div
                key={evento._id || idx}
                className="card"
                style={{
                  textAlign: "center",
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={evento.imagen}
                  alt={evento.titulo}
                  style={{
                    width: "100%",
                    maxWidth: 180,
                    margin: "0 auto 1rem auto",
                    borderRadius: 12,
                    boxShadow: "0 2px 12px #1E3A8A33",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "Orbitron",
                    color: "#D4AF37",
                    fontSize: "1.1rem",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {evento.titulo}
                </h3>
                <p
                  style={{
                    color: "#E0E0E0",
                    fontSize: "1rem",
                    marginBottom: 8,
                  }}
                >
                  {evento.fecha} - {evento.lugar}
                </p>
                {evento.registroLink && (
                  <a
                    href={evento.registroLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-button"
                    style={{
                      fontSize: "1rem",
                      borderRadius: 16,
                      padding: "0.5rem 1.2rem",
                    }}
                  >
                    Ver evento
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CURSOS DESTACADOS — primeros 4 del catálogo */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto 3rem auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginBottom: "1rem",
            padding: "0 0.25rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Orbitron",
                color: "#D4AF37",
                fontSize: "clamp(1.25rem, 3.5vw, 1.7rem)",
                margin: "0 0 0.25rem",
                lineHeight: 1.15,
              }}
            >
              Conoce más sobre blockchain
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "clamp(0.85rem, 2.2vw, 0.95rem)",
                margin: 0,
              }}
            >
              Empieza con cualquiera de nuestros cursos gratuitos.
            </p>
          </div>
          <Link
            to="/cursos"
            style={{
              color: "#D4AF37",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            Ver todos
            <FontAwesomeIcon
              icon={faArrowRight}
              style={{ fontSize: "0.7rem" }}
            />
          </Link>
        </div>

        <div
          className="cursos-destacados-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.85rem",
          }}
        >
          {cursosData.slice(0, 4).map((curso) => {
            const totalLecciones =
              (curso.capitulos?.reduce(
                (acc, c) => acc + c.secciones.length,
                0,
              ) ?? 0) + (curso.lecciones?.length ?? 0);
            const esPago = (curso.precioPuma ?? 0) > 0;
            return (
              <Link
                key={curso.id}
                to={`/registro-curso/${curso.id}`}
                style={{
                  background: "rgba(20,20,30,0.85)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: 14,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    aspectRatio: "16 / 10",
                    background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%), url(${curso.imagen}) center/cover no-repeat`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      display: "flex",
                      gap: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.65rem",
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.7)",
                        color: "#cbd5e1",
                        backdropFilter: "blur(6px)",
                        fontWeight: 600,
                      }}
                    >
                      {curso.nivel}
                    </span>
                    {esPago && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          padding: "2px 8px",
                          borderRadius: 999,
                          background:
                            "linear-gradient(90deg, #F4D03F, #D4AF37)",
                          color: "#0a0a0a",
                          fontWeight: 700,
                        }}
                      >
                        {curso.precioPuma?.toLocaleString("en-US")} $PUMA
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    padding: "0.85rem 1rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    gap: 6,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Orbitron",
                      color: "#F4D03F",
                      fontSize: "0.95rem",
                      margin: 0,
                      lineHeight: 1.25,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {curso.titulo}
                  </h3>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.78rem",
                      margin: 0,
                      lineHeight: 1.45,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      flex: 1,
                    }}
                  >
                    {curso.descripcion}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 4,
                      fontSize: "0.72rem",
                      color: "#94a3b8",
                    }}
                  >
                    <span>
                      {totalLecciones}{" "}
                      {totalLecciones === 1 ? "lección" : "lecciones"}
                    </span>
                    <span
                      style={{
                        color: "#D4AF37",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      Empezar
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        style={{ fontSize: "0.65rem" }}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <style>{`
        @media (max-width: 880px) {
          .cursos-destacados-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .cursos-destacados-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      </section>

      {/* PARTNERS - Ticker (datos en src/data/partnersData.ts, imágenes en public/images/partners/) */}
      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="text-center" style={{ marginBottom: "2rem" }}>
          Nuestros Aliados
        </h2>
        <div className="ticker-container">
          <div className="ticker-track">
            {partnersData.map((p, i) => (
              <div key={i} className="ticker-item card">
                <img
                  src={p.img}
                  alt={p.alt}
                  style={{ maxWidth: 100, maxHeight: 60, objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
      html {
        scroll-behavior: smooth;
        scroll-snap-type: y proximity;
      }

      .parallax-section {
        min-height: 100vh;
        scroll-snap-align: start;
        scroll-snap-stop: always;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        padding: 2rem 0;
        scroll-margin-top: 0;
      }

      .section-content {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 3rem;
        position: relative;
        z-index: 1;
        background: rgba(10, 10, 10, 0.3);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(212, 175, 55, 0.1);
        transform: translateZ(0);
        will-change: transform;
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      /* Ajustes para el scroll suave */
      @media (prefers-reduced-motion: no-preference) {
        html {
          scroll-behavior: smooth;
        }
      }

      /* Ajustes específicos para trackpad */
      @media (hover: none) and (pointer: coarse) {
        .parallax-section {
          scroll-snap-type: y mandatory;
        }
      }

      /* Ajustes para mouse/trackpad */
      @media (hover: hover) and (pointer: fine) {
        .parallax-section {
          scroll-snap-type: y proximity;
        }
      }

      .video-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
        width: 100%;
      }

      .video-container iframe {
        width: 100%;
        height: 70vh;
        min-height: 500px;
      }

      .graphs-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 2rem;
        width: 100%;
        margin: 0 auto;
        padding: 1rem;
      }

      .graph-card {
        background: rgba(10, 10, 10, 0.3);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(212, 175, 55, 0.1);
        padding: 2rem;
        transition: transform 0.3s ease;
        height: 100%;
        min-height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
      }

      .graph-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
      }

      .graph-card .recharts-wrapper {
        height: 100% !important;
        width: 100% !important;
        min-width: 0;
        padding: 1rem;
      }

      .progress-bar {
        position: fixed;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #D4AF37, #2563EB);
        bottom: 0;
        transform-origin: 0%;
        z-index: 1000;
        opacity: 0.8;
      }

      /* Ajustes para el grid de stats */
      .grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
        gap: 3rem !important;
        width: 100%;
      }

      /* Ajustes para el grid de features */
      .grid-4 {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
        gap: 3rem !important;
        width: 100%;
      }

      /* Ajustes para el grid de blockchain tech */
      .blockchain-tech-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
        gap: 3rem !important;
        width: 100%;
      }

      .ticker-container {
        width: 100%;
        overflow: hidden;
        position: relative;
        margin: 0 auto;
        padding: 1.5rem 0;
        background: rgba(10, 10, 10, 0.2);
        border-radius: 20px;
        box-shadow: 0 4px 24px rgba(30,58,138,0.08);
      }
      .ticker-track {
        display: flex;
        width: max-content;
        animation: ticker 18s linear infinite;
      }
      .ticker-container:hover .ticker-track {
        animation-play-state: paused;
      }
      .ticker-item {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 180px;
        margin: 0 2rem;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        padding: 1rem 2rem;
        transition: transform 0.2s;
      }
      .ticker-item img {
        filter: none;
      }
      @keyframes ticker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @media (max-width: 900px) {
        .parallax-section {
          min-height: 70vh;
          padding: 1.2rem 0;
        }
        .section-content {
          padding: 1.2rem;
          min-height: 60vh;
        }
        .graphs-container {
          grid-template-columns: 1fr;
          gap: 1.2rem;
          padding: 0.5rem;
        }
        .graph-card {
          min-height: 320px;
          padding: 0;
          overflow-x: auto;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
        }
        .graph-card h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        .graph-card .recharts-wrapper {
          height: 100% !important;
          width: 100% !important;
          min-width: 0;
        }
      }
      @media (max-width: 600px) {
        .parallax-section {
          min-height: 50vh;
          padding: 0.5rem 0;
        }
        .section-content {
          padding: 0.5rem;
          min-height: 40vh;
        }
        .graph-card {
          min-height: 220px;
          padding: 0;
          overflow-x: auto;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
        }
        .graph-card h3 {
          font-size: 1rem;
        }
        .graph-card .recharts-wrapper {
          height: 100% !important;
          width: 100% !important;
          min-width: 0;
        }
      }
      .learning-path-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3rem;
        max-width: 900px;
        margin: 0 auto;
      }
      @media (max-width: 900px) {
        .learning-path-grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }
      .testimonios-carousel-container-wide {
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
      }
      .testimonio-card-wide {
        max-width: 900px !important;
        min-width: 500px;
        min-height: 420px;
      }
      @media (max-width: 1200px) {
        .testimonios-carousel-container-wide {
          max-width: 98vw;
        }
        .testimonio-card-wide {
          max-width: 98vw !important;
          min-width: unset;
          padding: 2rem 0.5rem;
        }
      }
      @media (max-width: 700px) {
        .testimonio-card-wide {
          padding: 1.2rem 0.2rem;
          min-height: 320px;
        }
      }
      .glow-button:hover {
        box-shadow: 0 0 32px 8px #D4AF37cc, 0 0 48px 16px #2563EB99;
        background: linear-gradient(90deg, #1E3A8A 60%, #D4AF37 100%);
        color: #fff;
      }
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      @media (max-width: 768px) {
        .recap-section h2 {
          font-size: 1.8rem !important;
        }
        .recap-section p {
          font-size: 1.1rem !important;
        }
      }
    `}</style>
    </div>
  );
};

export default Home;
