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
import { HACKATHON_INFO, NUM_TRACKS, TRACKS_EN_LINEA, FECHAS_CARTEL } from "../data/hackathonInfo";
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
import Reveal from "../components/Reveal";
import Seccion from "../components/goya/Seccion";
import Multitud from "../components/goya/Multitud";
import BandaCU from "../components/goya/BandaCU";
import LogoCriptoUNAM from "../components/goya/LogoCriptoUNAM";
import { Marco } from "../components/goya/adornos";

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
          fontFamily: "Chakra Petch",
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
  // Evento próximo destacado: Goya Hack en la Facultad de Ingeniería.
  // Nombre, fechas y duración salen de HACKATHON_INFO: escritas a mano, la
  // fecha se quedó en "21 - 24" cuando el evento pasó a ser del 22 al 26.
  const hackathonUnamHome = {
    id: "hackathon-unam-home",
    title: `${HACKATHON_INFO.brand} · Facultad de Ingeniería`,
    date: `${FECHAS_CARTEL.rango} Septiembre, 2026`,
    time: HACKATHON_INFO.event,
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

  /* Los cuatro pilares de la comunidad, con la numeración del cartel. */
  const PILARES = [
    {
      n: "01",
      titulo: "Cursos gratuitos",
      cuerpo:
        "Blockchain, Solidity, DeFi y NFTs desde cero. Sin costo y con certificado on-chain al terminar.",
      to: "/cursos",
      cta: "Ver cursos",
    },
    {
      n: "02",
      titulo: "Eventos y talleres",
      cuerpo:
        "Meetups, workshops y sesiones presenciales en Ciudad Universitaria durante todo el año.",
      to: "/eventos",
      cta: "Ver eventos",
    },
    {
      n: "03",
      titulo: "Hackathones",
      cuerpo:
        "Competimos y ganamos. De ahí salen las startups que hoy siguen en desarrollo activo.",
      to: "/hackathon",
      cta: "Goya Hack",
    },
    {
      n: "04",
      titulo: "Comunidad y recompensas",
      cuerpo:
        "Más de 500 personas construyendo juntas. Participa, gana $PUMA y canjéalo por cursos premium.",
      to: "/recompensas",
      cta: "Recompensas",
    },
  ];

  const cursosVisibles = (cursosHome.length > 0 ? cursosHome : cursosData).slice(
    0,
    3,
  );
  const noticiasVisibles = newslettersHome.slice(0, 3);
  const startupsVisibles = proyectosHacksData.slice(0, 4);

  return (
    <div className="home-page goya-scope">
      {/* ==================================================================
          HERO — la portada del cartel de Community Partner: la multitud de
          figuras arriba y el lockup de marca abajo a la izquierda.
          ================================================================== */}
      <section className="relative mx-auto flex min-h-[88svh] w-full max-w-[1500px] flex-col justify-between gap-8 px-5 pb-12 pt-8 sm:px-8 md:px-12">
        <div>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <Reveal
                inmediato
                as="p"
                delay={100}
                className="font-mono text-[11px] uppercase tracking-label text-goya-paper sm:text-sm"
              >
                Comunidad Web3 de la
              </Reveal>

              <Reveal
                inmediato
                as="div"
                delay={180}
                className="goya-rule mt-1 w-fit max-w-full"
              >
                <p className="font-mono text-sm italic uppercase tracking-label text-goya-amber sm:text-lg md:text-xl">
                  Universidad Nacional Autónoma de México
                </p>
              </Reveal>
            </div>

            {/* La marca del sitio. La G de píxeles se quedó en /hackathon,
                que es de donde viene: aquí manda el emblema de CriptoUNAM. */}
            <Reveal inmediato as="div" delay={160} className="shrink-0">
              <LogoCriptoUNAM className="h-16 w-auto sm:h-24 md:h-28 lg:h-32" />
            </Reveal>
          </div>

          {/* La multitud: el motivo de comunidad del cartel. Mucha gente
              distinta avanzando en la misma dirección. */}
          <Reveal
            inmediato
            as="div"
            delay={260}
            className="mt-8 text-goya-paper/80 md:mt-10"
          >
            <Multitud cantidad={16} />
          </Reveal>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="min-w-0">
            <Reveal
              inmediato
              as="h1"
              delay={320}
              className="font-display text-[clamp(2.5rem,8.5vw,7rem)] font-normal uppercase leading-[0.86] tracking-tight text-goya-paper"
            >
              <span className="block">Cripto</span>
              <span className="mt-1 flex items-center gap-[0.42em] pl-[0.32em]">
                <span
                  className="inline-block h-[0.5em] w-[0.055em] shrink-0 bg-goya-amber"
                  aria-hidden="true"
                />
                <span>UNAM</span>
              </span>
            </Reveal>

            <Reveal
              inmediato
              as="p"
              delay={400}
              className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300"
            >
              Formamos a la próxima generación de constructores descentralizados.
              Cursos gratuitos, hackathones, eventos en Ciudad Universitaria y una
              comunidad de más de 500 personas.
            </Reveal>
          </div>

          <Reveal
            inmediato
            as="div"
            delay={480}
            className="flex flex-col gap-3 sm:flex-row lg:pb-1"
          >
            <Link
              to="/cursos"
              className="goya-cut group inline-flex items-center justify-center gap-2 bg-goya-amber px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
              style={{ ["--cut" as string]: "10px" }}
            >
              Explora los cursos
              <FontAwesomeIcon icon={faArrowRight} className="text-[0.7rem] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/eventos"
              className="goya-cut inline-flex items-center justify-center border border-goya-amber/45 px-7 py-3.5 font-mono text-xs uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
              style={{ ["--cut" as string]: "10px" }}
            >
              Únete a la comunidad
            </Link>
          </Reveal>
        </div>

        <Marco className="pointer-events-none absolute bottom-6 right-5 hidden text-slate-500 sm:right-8 md:right-12 lg:block" />
      </section>

      {/* ==================================================================
          GOYA HACK — el evento insignia, destacado sobre el resto.
          ================================================================== */}
      <section className="goya-anchor mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 md:px-12 md:py-20">
        <div className="goya-panel goya-panel-lit" style={{ ["--cut" as string]: "28px" }}>
          <div className="flex flex-col gap-10 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="min-w-0">
              <Reveal
                as="p"
                delay={100}
                className="font-mono text-[11px] uppercase tracking-label text-goya-amber"
              >
                {HACKATHON_INFO.registroAbierto
                  ? "Registro abierto"
                  : "Próximamente"}
                {" · "}
                {HACKATHON_INFO.event}
              </Reveal>

              <Reveal
                as="h2"
                delay={180}
                className="mt-4 font-display text-4xl uppercase leading-[1] tracking-wide text-goya-paper sm:text-5xl md:text-6xl"
              >
                {HACKATHON_INFO.brand}
              </Reveal>

              <Reveal
                as="p"
                delay={240}
                className="goya-rule mt-3 w-fit font-mono text-sm uppercase tracking-label text-goya-amber"
              >
                {FECHAS_CARTEL.completo} · Facultad de Ingeniería
              </Reveal>

              <Reveal
                as="p"
                delay={300}
                className="mt-5 max-w-lg text-sm leading-relaxed text-slate-400"
              >
                {HACKATHON_INFO.horas} horas construyendo con inteligencia
                artificial y Web3 en {NUM_TRACKS} tracks: {TRACKS_EN_LINEA}.
                Gratis y abierto a estudiantes de cualquier universidad.
              </Reveal>

              <Reveal as="div" delay={380} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/hackathon"
                  className="goya-cut inline-flex items-center justify-center bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
                  style={{ ["--cut" as string]: "9px" }}
                >
                  Conoce Goya Hack
                </Link>
                <Link
                  to="/hackathon/dashboard"
                  className="goya-cut inline-flex items-center justify-center border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
                  style={{ ["--cut" as string]: "9px" }}
                >
                  Regístrate
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================================
          CIUDAD UNIVERSITARIA — la banda de vídeo, justo bajo Goya Hack.
          ================================================================== */}
      <BandaCU
        id="cu"
        rotulo="Ciudad Universitaria"
        titulo="De donde venimos"
        etiqueta="UNAM · Ciudad de México"
        pie="CriptoUNAM"
        subpie="Comunidad Web3 de la UNAM"
      />

      {/* ==================================================================
          QUÉ HACEMOS
          ================================================================== */}
      <Seccion
        rotulo="Qué hacemos"
        titulo="Aprende, construye, gana"
        intro="Todo lo que ofrece CriptoUNAM es gratuito y abierto. No necesitas experiencia previa para empezar."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p, i) => (
            <Reveal
              key={p.n}
              as="article"
              delay={180 + i * 100}
              className="goya-panel goya-panel-hover h-full"
            >
              <div className="flex h-full flex-col p-6">
                <span className="font-mono text-[11px] font-bold tracking-label text-goya-amber">
                  {p.n}
                </span>
                <h3 className="mt-4 font-display text-lg uppercase leading-tight tracking-wide text-goya-paper">
                  {p.titulo}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {p.cuerpo}
                </p>
                <Link
                  to={p.to}
                  className="group mt-5 inline-flex items-center gap-2 border-t border-goya-amber/15 pt-4 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                >
                  {p.cta}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[0.6rem] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Seccion>

      {/* ==================================================================
          LOGROS
          ================================================================== */}
      <Seccion
        rotulo="Logros"
        titulo="Lo que llevamos construido"
        intro="Cifras que demuestran el impacto y el crecimiento de la comunidad."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              as="div"
              delay={160 + i * 90}
              className="goya-panel goya-panel-hover"
            >
              <div className="flex flex-col gap-3 p-6">
                <FontAwesomeIcon
                  icon={s.icon}
                  style={{ color: "#E9AF3C", fontSize: "1.3rem" }}
                />
                <span className="font-display text-4xl leading-none text-goya-paper">
                  {s.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                  {s.label}
                </span>
                <span className="text-sm leading-relaxed text-slate-400">
                  {s.description}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Seccion>

      {/* ==================================================================
          CURSOS
          ================================================================== */}
      <Seccion
        rotulo="Cursos"
        titulo="Empieza por aquí"
        intro="Cursos completos y gratuitos, con certificado on-chain al terminar."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {cursosVisibles.map((c: any, i: number) => (
            <Reveal
              key={c.id ?? c.titulo}
              as="article"
              delay={180 + i * 110}
              className="goya-panel goya-panel-hover h-full"
            >
              <div className="flex h-full flex-col">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={c.imagen}
                    alt={c.titulo}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-60 transition-opacity duration-500 hover:opacity-85"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(4,7,14,0.96) 10%, rgba(4,7,14,0.35) 60%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                  {c.nivel && (
                    <span className="absolute left-4 top-4 bg-goya-amber px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-label text-goya-void">
                      {c.nivel}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-goya-paper">
                    {c.titulo}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                    {c.descripcion}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-goya-amber/15 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-label text-slate-500">
                      {c.duracion ?? "A tu ritmo"}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-label text-goya-amber">
                      {c.precio === 0 ? "Gratis" : `${c.precioPuma} $PUMA`}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" delay={420} className="mt-10">
          <Link
            to="/cursos"
            className="goya-cut inline-flex items-center gap-2 border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
            style={{ ["--cut" as string]: "9px" }}
          >
            Ver todos los cursos
          </Link>
        </Reveal>
      </Seccion>

      {/* ==================================================================
          EVENTOS
          ================================================================== */}
      <Seccion
        rotulo="Agenda"
        titulo="Próximos eventos"
        intro="Meetups, talleres y sesiones presenciales. La mayoría en Ciudad Universitaria."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {eventosCarousel.slice(0, 3).map((e: any, i: number) => (
            <Reveal
              key={e.id}
              as="article"
              delay={180 + i * 110}
              className="goya-panel goya-panel-hover h-full"
            >
              <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden">
                <img
                  src={e.image}
                  alt={e.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale transition-all duration-500 hover:opacity-70 hover:grayscale-0"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(4,7,14,0.97) 14%, rgba(4,7,14,0.6) 52%, rgba(17,36,65,0.2) 100%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative p-6">
                  <span className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                    {e.date}
                    {e.time ? ` · ${e.time}` : ""}
                  </span>
                  <h3 className="mt-2 font-display text-base uppercase leading-tight tracking-wide text-goya-paper">
                    {e.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {e.location}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" delay={420} className="mt-10">
          <Link
            to="/eventos"
            className="goya-cut inline-flex items-center gap-2 border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
            style={{ ["--cut" as string]: "9px" }}
          >
            Ver todos los eventos
          </Link>
        </Reveal>
      </Seccion>

      {/* ==================================================================
          STARTUPS
          ================================================================== */}
      <Seccion
        rotulo="Proyectos"
        titulo="Startups de la comunidad"
        intro="Proyectos nacidos en hackathones que hoy siguen en desarrollo activo."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {startupsVisibles.map((p, i) => (
            <Reveal
              key={p.id}
              as="article"
              delay={170 + i * 100}
              className="goya-panel goya-panel-hover h-full"
            >
              <div className="flex h-full flex-col p-6">
                <span className="flex h-24 items-center justify-center">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    loading="lazy"
                    className="max-h-20 max-w-full object-contain"
                  />
                </span>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <h3 className="font-display text-base uppercase tracking-wide text-goya-paper">
                    {p.nombre}
                  </h3>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-label text-goya-amber">
                    {p.red}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {p.descripcion}
                </p>
                {(p.demo || p.repo) && (
                  <div className="mt-5 flex gap-4 border-t border-goya-amber/15 pt-4">
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                      >
                        Demo →
                      </a>
                    )}
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase tracking-label text-slate-400 no-underline transition-colors duration-300 hover:text-goya-amber"
                      >
                        Código →
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" delay={420} className="mt-10">
          <Link
            to="/proyectos"
            className="goya-cut inline-flex items-center gap-2 border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
            style={{ ["--cut" as string]: "9px" }}
          >
            Ver todos los proyectos
          </Link>
        </Reveal>
      </Seccion>

      {/* ==================================================================
          COMUNIDAD — las fotos en marquesina
          ================================================================== */}
      <Seccion
        rotulo="Comunidad"
        titulo="Somos más de 500"
        intro="Momentos de eventos, talleres y hackathones. Esto es lo que pasa cuando la comunidad se junta."
      >
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
              <div className={`fotos-marquee-track fotos-marquee-track--${rowIdx}`}>
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

        <div className="mt-14 text-goya-paper/70">
          <Multitud cantidad={16} />
        </div>

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
            overflow: hidden;
            border: 1px solid rgba(233,175,60,0.22);
            background: rgba(4,7,14,0.6);
          }
          .fotos-marquee-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            filter: grayscale(1);
            opacity: 0.7;
            transition: transform 0.4s ease, filter 0.4s ease, opacity 0.4s ease;
          }
          .fotos-marquee-card:hover img {
            transform: scale(1.05);
            filter: grayscale(0);
            opacity: 1;
          }
          @media (prefers-reduced-motion: reduce) {
            .fotos-marquee-track--0,
            .fotos-marquee-track--1,
            .fotos-marquee-track--2 {
              animation: none;
            }
          }
        `}</style>
      </Seccion>

      {/* ==================================================================
          NOTICIAS + NEWSLETTER
          ================================================================== */}
      <Seccion
        rotulo="Newsletter"
        titulo="Últimas noticias"
        intro="Lo que publicamos sobre blockchain, IA y lo que pasa en la comunidad."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {noticiasVisibles.map((n: any, i: number) => (
            <Reveal
              key={n.id}
              as="article"
              delay={180 + i * 110}
              className="goya-panel goya-panel-hover h-full"
            >
              <Link to={`/newsletter/${n.id}`} className="flex h-full flex-col no-underline">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={n.imagen}
                    alt={n.titulo}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-55 transition-opacity duration-500 hover:opacity-80"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(4,7,14,0.95) 10%, rgba(4,7,14,0.3) 60%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                    {n.fecha}
                  </span>
                  <h3 className="mt-2 flex-1 font-display text-base uppercase leading-tight tracking-wide text-goya-paper">
                    {n.titulo}
                  </h3>
                  <span className="mt-4 font-mono text-[10px] uppercase tracking-label text-slate-400">
                    Leer →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Suscripción */}
        <Reveal as="div" delay={420} className="goya-panel mt-12" style={{ ["--cut" as string]: "20px" }}>
          <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-display text-xl uppercase tracking-wide text-goya-paper">
                Recibe el newsletter
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                Una edición cada tanto, sin ruido: lo que aprendimos, lo que
                viene y las convocatorias abiertas.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                aria-label="Correo electrónico"
                className="goya-cut w-full border border-goya-amber/30 bg-black/40 px-4 py-3 font-mono text-xs text-goya-paper outline-none transition-colors duration-300 placeholder:text-slate-600 focus:border-goya-amber"
                style={{ ["--cut" as string]: "8px" }}
              />
              <button
                type="submit"
                className="goya-cut shrink-0 bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void transition-colors duration-300 hover:bg-goya-paper"
                style={{ ["--cut" as string]: "8px" }}
              >
                Suscribirme
              </button>
            </form>
          </div>

          {showNewsletterSuccess && (
            <p className="px-8 pb-6 font-mono text-[11px] uppercase tracking-label text-emerald-300">
              Listo, ya estás suscrito.
            </p>
          )}
          {showNewsletterError && (
            <p className="px-8 pb-6 font-mono text-[11px] uppercase tracking-label text-red-300">
              No se pudo completar la suscripción. Inténtalo de nuevo.
            </p>
          )}
        </Reveal>
      </Seccion>

      {/* ==================================================================
          TOKEN $PUMA
          ================================================================== */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 md:px-12">
        <Reveal as="div" className="goya-panel" style={{ ["--cut" as string]: "24px" }}>
          <div className="flex flex-col gap-8 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                Token de la comunidad
              </span>
              <h3 className="mt-3 font-display text-3xl uppercase tracking-wide text-goya-paper sm:text-4xl">
                $PUMA
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                El token exclusivo de CriptoUNAM. Gánalo participando en misiones
                y úsalo para comprar cursos premium y acceder a eventos.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                to="/recompensas"
                className="goya-cut inline-flex items-center justify-center bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
                style={{ ["--cut" as string]: "9px" }}
              >
                Recompensas
              </Link>
              <Link
                to="/cursos"
                className="goya-cut inline-flex items-center justify-center border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
                style={{ ["--cut" as string]: "9px" }}
              >
                Cursos
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ==================================================================
          ALIADOS
          ================================================================== */}
      <Seccion
        rotulo="Aliados"
        titulo="Quiénes nos acompañan"
      >
        <div className="flex flex-wrap items-center gap-4">
          {partnersData.map((p, i) => (
            <div
              key={i}
              className="goya-panel goya-panel-hover group w-[150px]"
              title={p.alt}
            >
              <span className="flex min-h-[92px] items-center justify-center p-5">
                <img
                  src={p.img}
                  alt={p.alt}
                  loading="lazy"
                  className="max-h-12 max-w-full object-contain opacity-60 transition-opacity duration-300 [filter:brightness(0)_invert(1)] group-hover:opacity-100"
                />
              </span>
            </div>
          ))}
        </div>
      </Seccion>
    </div>
  );
};

export default Home;
