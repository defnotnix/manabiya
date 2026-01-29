"use client";

import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  Brain,
  BrainIcon,
  GraphIcon,
  Image as ImageIcon,
  MagnifyingGlass,
  MagnifyingGlassIcon,
  Paperclip,
  PaperPlaneRight,
  PaperPlaneRightIcon,
  Sparkle,
  SparkleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = ["for more", "for purpose", "framework"];

export function ModuleDashboard() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container
      size="xl"
      style={{
        height: "calc(100vh - 50px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <svg
        pointer-events="none"
        className="leaflet-zoom-animated"
        width="1150"
        height="598"
        viewBox="24 -120 1150 598"
        style={{
          transform: "translate3d(160px, -50px, 0px)",
        }}
      >
        <g>
          <path
            stroke="#000000"
            strokeOpacity="1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#DD97EA"
            fill-opacity="0.7"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            stroke="#000000"
            strokeOpacity="1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#EDEDED"
            fill-opacity="0.7"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            stroke="#000000"
            strokeOpacity="1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#E5CB3E"
            fill-opacity="0.7"
            fill-rule="evenodd"
            d="M1177 481L1177 147L1153 131L1139 145L1128 139L1122 138L1109 140L1100 133L1097 135L1093 134L1085 126L1076 128L1073 128L1071 126L1065 127L1056 132L1047 141L1041 143L1038 148L1036 156L1031 162L1031 165L1034 169L1034 173L1032 175L1026 197L1011 201L1007 204L1009 208L1007 209L1006 213L1005 214L1002 211L999 212L996 218L981 233L979 237L983 243L983 246L986 249L985 252L987 255L986 258L983 260L981 266L982 269L980 270L978 281L976 284L976 292L974 293L976 300L975 308L972 310L965 311L960 308L955 308L949 317L950 323L946 328L934 325L928 330L922 322L912 313L904 313L901 311L893 316L892 321L888 327L888 335L884 339L882 350L876 361L877 364L874 369L875 373L870 377L868 381L868 384L871 389L871 394L868 397L868 401L871 405L870 409L869 411L860 411L859 414L854 414L852 416L852 422L849 426L844 431L840 431L843 435L839 440L832 440L828 444L822 445L822 451L818 456L817 464L813 467L813 469L815 470L812 472L813 481z"
          ></path>
          <path
            stroke="#000000"
            strokeOpacity="1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#F2A35A"
            fill-opacity="0.7"
            fill-rule="evenodd"
            d="M1047 141L1056 132L1065 127L1071 126L1073 128L1076 128L1085 126L1090 114L1090 110L1095 106L1096 93L1099 89L1098 85L1094 81L1091 74L1092 69L1089 54L1090 46L1085 45L1081 42L1079 35L1083 32L1089 23L1090 15L1092 15L1093 12L1097 9L1101 11L1113 11L1118 7L1121 1L1121 -8L1125 -13L1126 -17L1128 -18L1128 -27L1130 -29L1142 -28L1143 -30L1142 -34L1144 -38L1144 -44L1141 -51L1146 -58L1145 -61L1141 -63L1139 -67L1139 -74L1134 -77L1133 -82L1145 -88L1151 -106L1141 -110L1144 -118L1140 -119L1139 -121L1126 -119L1121 -121L1120 -123L1023 -123L1019 -116L1013 -114L1007 -103L1000 -96L996 -89L998 -86L1001 -85L1001 -83L995 -77L983 -72L981 -73L970 -67L967 -79L948 -80L944 -75L941 -74L938 -74L935 -78L934 -76L928 -75L924 -69L911 -69L906 -65L903 -59L848 -91L837 -92L822 -99L815 -98L807 -101L803 -108L798 -111L784 -114L787 -117L789 -123L21 -123L21 481L34 481L37 476L42 472L47 475L45 478L47 481L51 479L52 475L59 481L68 481L73 478L76 481L813 481L812 472L815 471L813 467L817 465L817 459L822 451L822 446L828 444L832 440L839 440L843 436L840 432L849 426L852 422L852 417L854 414L859 414L860 411L864 412L870 409L871 406L868 401L868 397L871 394L871 389L868 384L868 381L870 377L875 373L874 369L877 364L876 361L881 353L884 339L888 335L888 327L892 321L893 316L901 311L904 313L912 313L922 322L928 330L934 325L946 328L950 323L949 318L955 308L960 308L965 311L972 310L976 307L974 293L976 292L976 284L978 281L980 270L982 269L981 266L983 260L987 256L985 252L986 249L983 246L983 243L979 237L985 228L990 225L996 218L999 212L1001 211L1005 214L1006 213L1007 209L1009 208L1007 204L1011 201L1026 197L1032 175L1034 173L1034 169L1031 165L1031 162L1036 156L1038 148L1041 143L1045 142z"
          ></path>
          <path
            stroke="#000000"
            strokeOpacity="1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#8FD484"
            fill-opacity="0.7"
            fill-rule="evenodd"
            d="M76 481L73 478L68 481L59 481L52 475L51 479L48 481L45 478L47 476L45 473L42 472L37 476L34 481z"
          ></path>
          <path
            stroke="#000000"
            strokeOpacity="1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#2CA4F5"
            fill-opacity="0.7"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            stroke="#000000"
            strokeOpacity="1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#E56B61"
            fill-opacity="0.7"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-506"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-660"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M23 258L26 252L28 252L29 248L32 248L38 243L36 241L40 235L39 228L36 225L36 223L29 221L27 216L23 216z"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-503"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-647"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-621"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-679"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-516"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-504"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-507"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M1121 138L1109 139L1102 137L1099 133L1093 135L1084 127L1074 128L1069 126L1054 132L1044 142L1039 143L1034 156L1029 161L1033 171L1028 182L1028 187L1025 196L1009 201L1006 204L1007 208L1003 214L999 210L990 223L979 233L977 237L981 243L981 246L984 248L984 252L986 255L979 266L980 269L977 273L977 280L974 284L972 294L975 302L974 307L970 310L967 309L963 311L962 309L953 308L947 317L948 325L944 328L932 324L927 330L918 319L916 319L910 313L905 312L902 313L899 311L896 315L890 318L890 321L886 327L886 334L875 360L873 373L868 377L866 381L866 384L869 386L869 394L866 399L869 405L868 410L862 412L858 410L857 414L853 414L851 416L848 426L844 428L843 431L839 431L841 435L837 439L831 439L829 442L820 445L820 451L817 454L815 464L811 469L813 470L811 472L811 479L1011 479L1013 471L1011 465L1013 461L1017 459L1016 453L1013 453L1012 451L1019 441L1019 439L1024 438L1026 436L1028 420L1027 416L1007 412L1005 406L998 399L997 389L1002 392L1010 390L1016 391L1020 388L1029 386L1031 383L1035 382L1045 371L1050 357L1064 357L1082 349L1090 348L1090 345L1095 334L1095 325L1103 323L1114 316L1120 306L1117 297L1128 285L1132 278L1138 275L1146 274L1150 267L1150 261L1154 244L1152 239L1142 231L1142 224L1146 219L1145 215L1147 210L1152 206L1151 201L1150 198L1142 192L1135 176L1136 172L1134 169L1136 164L1124 143z"
            aria-describedby="leaflet-tooltip-513"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-643"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-618"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-636"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-505"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M1084 126L1088 110L1090 107L1093 106L1094 93L1097 89L1096 84L1092 81L1089 74L1091 69L1087 54L1088 46L1083 45L1079 42L1077 35L1081 32L1087 23L1087 17L1088 15L1090 15L1091 11L1094 11L1096 9L1103 11L1111 11L1116 7L1120 -4L1119 -8L1126 -19L1126 -27L1128 -29L1140 -28L1141 -30L1143 -39L1140 -51L1145 -58L1143 -61L1139 -63L1137 -67L1137 -74L1133 -77L1131 -82L1143 -88L1143 -91L1146 -94L1147 -99L1149 -101L1149 -106L1140 -111L1142 -118L1138 -119L1137 -121L1124 -119L1119 -121L1020 -121L1017 -117L1012 -115L1005 -103L997 -95L995 -89L996 -86L1000 -85L996 -79L991 -76L982 -72L979 -73L968 -67L966 -74L967 -76L965 -79L946 -80L940 -74L936 -75L933 -78L932 -76L925 -74L922 -69L907 -68L901 -61L846 -91L827 -95L821 -99L814 -98L810 -99L809 -101L805 -101L801 -108L798 -109L797 -111L787 -112L783 -114L787 -121L665 -121L667 -112L669 -108L672 -106L671 -82L677 -71L676 -66L678 -59L676 -53L679 -50L676 -46L680 -44L682 -45L684 -42L685 -28L688 -25L692 -9L689 -6L688 -2L690 3L688 10L692 14L701 18L708 27L713 39L723 43L728 41L742 50L748 67L757 74L769 93L769 101L783 114L775 123L773 129L764 130L764 135L762 139L763 141L760 147L757 145L756 146L757 152L754 154L748 171L748 180L751 185L751 194L748 206L743 210L738 221L738 229L743 243L738 256L722 270L723 274L720 279L721 280L715 285L715 287L711 287L710 290L706 290L704 294L696 298L697 300L695 305L685 307L682 310L677 320L677 324L675 324L672 329L655 334L654 338L651 340L639 342L629 341L626 339L625 340L626 345L628 347L631 347L629 349L632 353L632 357L630 360L632 361L628 367L625 364L620 370L616 371L618 375L615 376L616 380L613 380L613 388L615 389L611 393L613 395L611 398L612 402L609 406L610 409L606 410L607 412L600 418L597 418L597 421L588 424L588 426L583 431L584 434L582 437L585 444L583 446L586 452L601 457L604 453L608 455L610 459L622 462L622 465L628 468L629 472L641 473L646 476L646 479L811 479L811 472L813 471L811 469L815 464L817 454L820 451L820 446L829 442L831 439L837 439L841 436L839 432L843 431L844 428L848 426L851 416L853 414L857 414L858 410L861 412L868 410L869 405L866 399L869 394L869 386L866 384L866 381L868 377L873 373L875 360L886 334L886 327L890 321L890 318L896 315L899 311L902 313L905 312L910 313L916 319L918 319L927 330L932 324L944 328L948 325L947 318L953 308L962 309L963 311L967 309L970 310L974 307L975 302L972 294L974 290L974 284L977 280L977 273L980 269L979 266L986 256L984 248L981 246L981 243L977 237L979 233L990 223L999 210L1003 214L1007 208L1006 204L1009 201L1025 196L1028 187L1028 182L1033 171L1029 161L1034 156L1039 143L1044 142L1054 132L1064 127L1080 127z"
            aria-describedby="leaflet-tooltip-514"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-659"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-498"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-639"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-619"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-667"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M473 35L473 32L480 24L476 23L471 15L465 14L461 16L446 12L442 15L437 13L436 11L431 12L427 9L421 10L415 8L412 -6L409 -5L400 -11L394 -12L378 -29L376 -34L369 -30L366 -30L364 -32L340 -33L329 -41L326 -46L322 -49L320 -54L316 -54L299 -61L292 -66L287 -73L270 -71L267 -73L262 -81L254 -84L250 -88L242 -88L236 -85L230 -85L225 -88L219 -89L195 -89L183 -95L153 -80L146 -80L138 -75L132 -65L133 -62L135 -61L136 -54L139 -49L148 -40L152 -32L151 -28L147 -26L142 -17L133 -14L119 1L117 7L110 16L107 16L96 22L98 30L97 34L88 47L85 49L86 53L82 65L87 75L92 80L100 77L102 87L85 87L82 85L67 86L63 83L59 83L63 92L72 102L75 103L72 108L73 113L79 118L77 124L85 128L92 142L99 145L103 152L113 157L106 165L103 171L112 176L112 179L107 184L107 186L114 191L115 189L126 195L146 198L148 205L139 213L130 224L140 233L143 239L149 235L159 237L162 244L164 244L165 248L172 252L177 249L183 249L187 253L197 252L206 260L207 266L220 273L224 280L220 284L221 289L226 293L231 296L239 295L244 297L248 296L249 298L254 294L262 294L262 296L267 298L267 300L270 299L279 305L276 308L276 312L280 317L284 319L285 322L288 321L286 325L292 327L296 325L297 327L295 331L297 333L298 330L301 330L303 333L307 335L304 337L308 338L311 343L315 343L317 339L320 340L328 348L332 343L334 337L341 334L345 327L354 321L360 325L383 325L392 332L398 329L407 329L411 333L416 334L419 334L421 332L431 334L436 330L441 332L443 331L444 328L440 320L439 314L435 310L436 303L443 299L442 294L437 288L439 285L436 281L437 276L432 270L436 263L429 261L427 256L418 257L418 253L416 252L417 249L423 248L426 245L430 237L429 234L432 224L431 214L433 211L432 203L430 193L428 192L429 191L419 182L418 178L413 172L414 167L417 165L419 159L420 150L423 144L426 142L426 134L430 121L434 118L435 115L435 100L432 94L434 85L440 80L440 77L445 67L448 67L455 62L457 54L456 47L471 39z"
            aria-describedby="leaflet-tooltip-633"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-620"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-701"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="0"
            strokeWidth="0"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.01"
            fill-rule="evenodd"
            d="M691 13L686 19L677 23L665 23L664 21L648 29L646 28L634 31L631 26L631 23L626 21L619 12L613 -1L605 -7L599 -9L592 -9L585 -4L582 3L580 9L581 18L579 23L567 35L550 31L547 33L549 37L545 38L516 38L511 41L504 41L500 43L492 42L489 44L480 43L473 35L471 39L456 47L457 54L455 61L448 67L445 67L440 77L440 80L434 85L432 94L435 100L435 115L434 118L430 121L426 134L426 142L423 144L420 150L419 159L417 165L414 167L413 172L418 178L419 182L427 187L429 191L428 192L430 193L432 203L433 211L431 214L432 224L429 234L430 237L426 245L423 248L416 250L416 252L418 253L418 257L427 256L429 261L436 263L432 270L437 276L436 281L439 285L437 288L442 294L443 299L436 303L435 310L439 314L440 320L444 328L441 333L445 340L444 345L446 347L451 346L453 343L455 344L458 340L461 342L469 335L472 336L473 338L479 336L481 332L495 326L496 324L502 324L508 317L510 317L517 310L525 312L526 310L538 306L552 306L554 308L560 308L565 305L583 316L584 314L588 320L591 320L593 323L599 326L600 331L603 331L606 334L606 336L611 338L612 343L616 345L616 349L619 353L617 354L624 358L623 362L628 367L632 361L630 360L632 357L632 353L629 349L631 347L628 347L626 345L626 339L634 342L651 340L654 338L655 334L672 329L675 324L677 324L677 320L682 310L685 307L695 305L697 300L696 298L704 294L706 290L710 290L711 287L715 287L715 285L721 280L720 279L723 274L722 270L738 256L740 249L743 245L741 235L738 229L738 221L743 210L748 206L750 199L751 185L748 180L748 171L754 154L757 152L756 146L757 145L760 147L763 141L762 139L764 131L767 129L773 129L775 123L783 114L769 101L769 93L757 74L748 67L742 50L728 41L723 43L713 39L708 27L701 18L692 14z"
            aria-describedby="leaflet-tooltip-614"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-644"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-517"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M172 -121L182 -100L183 -95L195 -89L219 -89L225 -88L230 -85L236 -85L242 -88L250 -88L254 -84L262 -81L267 -73L270 -71L287 -73L289 -69L299 -61L310 -56L320 -54L322 -49L326 -46L329 -41L339 -33L364 -32L366 -30L369 -30L376 -34L378 -29L394 -12L400 -11L406 -6L412 -6L415 8L421 10L427 9L431 12L436 11L437 13L442 15L446 12L461 16L465 14L471 15L476 23L480 24L473 32L473 35L480 43L489 44L492 42L500 43L504 41L511 41L516 38L545 38L549 37L547 33L550 31L567 35L579 23L581 18L580 9L582 3L585 -4L592 -9L599 -9L605 -7L613 -1L626 21L631 23L631 26L634 31L646 28L648 29L664 21L665 23L677 23L686 19L691 13L688 10L690 3L688 -2L689 -6L692 -9L688 -25L685 -28L684 -42L682 -45L680 -44L676 -46L679 -50L676 -53L678 -59L676 -66L677 -71L671 -82L672 -106L669 -108L667 -112L665 -121z"
            aria-describedby="leaflet-tooltip-634"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-640"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M23 -121L23 -55L32 -56L33 -60L39 -65L39 -68L46 -82L48 -95L56 -98L63 -111L63 -116L69 -121z"
            aria-describedby="leaflet-tooltip-637"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M69 -121L63 -116L63 -111L56 -98L48 -95L46 -82L39 -69L39 -65L33 -61L32 -56L24 -55L23 122L28 125L32 124L43 106L42 101L46 90L50 84L60 82L67 86L82 85L85 87L102 87L100 77L92 80L83 68L82 65L86 53L85 49L88 47L97 34L98 30L96 22L107 16L110 16L117 7L119 1L128 -9L136 -16L139 -15L142 -17L147 -26L151 -28L151 -36L136 -54L135 -61L133 -62L132 -65L138 -75L145 -80L153 -80L183 -95L182 -100L178 -106L172 -121z"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-617"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-649"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M1175 479L1175 435L1170 433L1160 435L1147 432L1142 432L1139 435L1136 428L1136 422L1138 421L1140 415L1139 404L1142 397L1134 395L1133 396L1119 390L1110 390L1104 385L1102 381L1105 372L1118 355L1123 352L1129 345L1123 341L1118 340L1104 343L1099 342L1094 337L1090 345L1090 348L1088 349L1082 349L1064 357L1050 357L1045 371L1035 382L1031 383L1029 386L1020 388L1016 391L1010 390L1002 392L997 389L998 399L1005 406L1007 412L1027 416L1028 420L1026 436L1024 438L1019 439L1019 441L1012 451L1013 453L1016 453L1017 459L1013 461L1011 465L1013 471L1011 479z"
            aria-describedby="leaflet-tooltip-616"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-700"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M73 479L54 479L51 475L49 476L48 479L44 479L45 476L41 472L34 479z"
            aria-describedby="leaflet-tooltip-658"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M59 83L56 82L50 84L46 90L42 100L43 106L32 124L28 125L24 122L23 216L27 216L29 221L36 223L40 232L40 235L36 241L38 243L32 248L29 248L28 252L26 252L23 258L23 402L26 403L43 397L48 394L50 389L54 390L57 385L52 385L50 381L54 378L54 370L63 367L64 363L68 360L65 350L66 344L61 338L71 338L75 332L78 329L80 329L80 327L72 323L69 319L64 316L63 314L65 305L67 302L72 300L81 290L88 289L102 292L105 286L105 282L102 277L106 272L103 269L100 262L99 255L105 254L110 249L115 248L119 250L120 248L122 248L122 245L132 238L134 230L138 231L130 224L139 213L148 205L146 198L126 195L115 189L114 191L107 186L107 184L112 179L112 176L103 171L106 165L113 157L103 152L99 145L92 142L85 128L77 124L79 118L73 113L72 108L75 103L69 99L60 86z"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-648"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-661"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-699"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M1175 147L1151 131L1138 144L1127 139L1121 138L1132 155L1136 164L1134 169L1136 172L1135 176L1142 192L1150 198L1153 206L1147 210L1145 215L1146 219L1142 224L1142 231L1152 239L1154 244L1150 261L1151 264L1148 272L1146 274L1138 275L1132 278L1128 285L1117 297L1120 306L1114 316L1103 323L1095 325L1094 330L1094 337L1099 342L1104 343L1118 340L1129 344L1126 349L1118 355L1105 372L1102 381L1104 385L1110 390L1119 390L1133 396L1134 395L1142 397L1139 404L1140 415L1138 421L1136 422L1136 428L1139 435L1142 432L1160 435L1164 433L1170 433L1175 435z"
            aria-describedby="leaflet-tooltip-512"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-646"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-662"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-509"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-508"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-666"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-663"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-668"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-656"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-645"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-665"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-615"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-657"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-669"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-641"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-664"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M138 231L134 230L132 238L122 245L122 248L120 248L119 250L115 248L110 249L105 254L99 255L103 269L106 272L102 277L105 282L105 286L102 292L88 289L81 290L72 300L67 302L64 307L64 316L69 319L72 323L80 327L80 329L78 329L71 338L61 338L66 344L65 350L68 360L64 363L63 367L54 370L54 378L50 381L52 385L57 385L54 390L50 389L48 394L38 398L37 400L33 400L26 403L24 402L23 479L34 479L41 472L45 475L44 478L48 479L49 476L51 475L54 479L260 479L257 476L258 470L257 465L255 465L255 455L253 447L261 439L262 436L262 415L271 413L271 407L279 407L281 401L295 401L299 397L298 393L292 390L291 388L289 387L286 389L279 386L278 384L275 384L274 374L263 381L250 380L244 370L239 370L234 362L233 356L240 357L254 351L254 349L247 346L249 340L255 339L264 330L267 332L273 328L272 323L275 321L275 319L280 317L276 312L276 308L279 305L270 299L267 300L267 298L262 296L262 294L254 294L249 298L248 296L231 296L221 289L220 284L224 280L221 273L207 266L206 260L204 259L203 256L197 252L187 253L183 249L177 249L172 252L165 248L164 244L162 244L159 237L149 235L143 239L140 233z"
            aria-describedby="leaflet-tooltip-635"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M625 364L623 362L624 358L617 354L619 353L616 349L616 345L612 343L611 338L606 336L606 334L603 331L600 331L599 326L593 323L591 320L588 320L584 314L583 316L565 305L560 308L554 308L552 306L538 306L526 310L525 312L517 310L510 317L508 317L502 324L496 324L495 326L481 332L479 336L473 338L472 336L469 335L461 342L458 340L455 344L453 343L451 346L446 347L444 345L445 340L441 332L436 330L431 334L421 332L419 334L416 334L411 333L407 330L398 329L392 332L383 325L360 325L354 321L345 327L341 334L334 337L332 343L328 348L320 340L317 339L315 343L311 343L308 339L304 337L307 335L305 333L303 333L301 330L298 330L297 333L295 331L297 327L296 325L292 327L286 325L288 321L285 322L284 319L280 317L275 319L275 321L272 323L273 328L271 330L267 332L264 330L255 339L249 340L247 346L254 349L254 351L240 357L233 356L234 362L239 370L244 370L250 380L263 381L274 374L275 384L278 384L279 386L286 389L289 387L297 392L299 396L295 401L282 401L279 407L271 407L271 413L269 414L262 414L262 436L261 439L253 447L255 455L255 465L257 465L258 470L257 476L260 478L646 479L646 476L641 473L629 472L628 468L622 465L622 462L614 459L612 460L608 455L604 453L601 457L588 453L583 447L585 444L582 437L584 434L583 431L588 426L588 424L597 422L596 419L600 418L607 412L606 410L610 409L609 406L612 402L611 398L613 395L611 393L615 389L613 388L613 380L616 380L615 376L618 375L616 371L620 370L624 366z"
            aria-describedby="leaflet-tooltip-515"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-638"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#4b5563"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fill-opacity="0.05"
            fill-rule="evenodd"
            d="M0 0"
            aria-describedby="leaflet-tooltip-642"
          ></path>
          <path
            className="leaflet-interactive"
            stroke="#1f2937"
            strokeOpacity="1"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#f59e0b"
            fill-opacity="0.3"
            fill-rule="evenodd"
            d="M691 13L686 19L677 23L665 23L664 21L648 29L646 28L634 31L631 23L626 21L619 12L613 -1L605 -7L599 -9L592 -9L585 -4L580 9L581 17L579 23L574 29L567 35L550 31L547 33L549 35L550 42L564 53L571 64L574 70L574 74L576 76L569 95L572 109L571 122L567 128L566 133L569 148L566 159L558 163L558 166L556 166L549 172L545 172L542 174L540 176L540 181L535 180L525 171L522 171L517 176L512 178L507 178L505 181L492 181L489 184L485 181L478 183L476 180L468 184L464 183L461 179L457 179L453 181L448 188L439 195L437 194L431 197L433 211L431 214L432 224L429 233L430 237L426 245L423 248L416 250L416 252L418 253L418 257L427 256L429 261L436 263L432 270L437 276L436 281L439 285L438 288L443 296L443 299L436 303L435 310L439 314L440 320L444 328L441 334L445 340L446 347L451 346L453 343L455 344L458 340L460 342L466 340L469 335L472 336L473 338L479 336L481 332L496 326L496 324L502 324L508 317L510 317L517 310L525 311L538 306L552 306L554 308L560 308L565 305L580 313L581 315L584 314L588 320L591 320L593 323L599 326L599 330L603 331L606 333L607 337L611 338L612 343L616 345L616 349L618 350L619 353L617 354L624 358L623 362L628 366L632 361L630 359L632 357L632 353L629 349L632 349L630 346L628 347L626 345L625 340L627 339L629 341L634 342L651 340L654 338L655 335L663 331L672 329L675 326L675 324L677 324L677 320L682 310L685 307L695 305L697 300L696 298L705 294L703 292L704 291L705 292L706 290L710 290L711 287L715 287L715 284L717 284L721 280L720 278L723 274L723 271L730 264L731 261L738 256L743 245L741 235L738 229L738 220L743 210L748 206L750 199L751 185L748 180L748 172L754 155L756 153L757 154L756 146L757 145L760 147L763 141L764 131L767 129L773 129L783 114L769 101L769 93L758 75L748 66L742 50L729 41L724 42L713 39L708 27L702 18L697 17L693 14z"
            aria-describedby="leaflet-tooltip-739"
          ></path>
        </g>
      </svg>
    </Container>
  );
}
