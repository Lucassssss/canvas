"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import logoRound from "@/images/joii_berry_logo_round.svg"
import logoWithText from "@/images/joii_berry_logo_withtext.svg"

import { NavUser } from "@/components/nav-user"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

// Icons
import {
  RiLayout4Line,
  RiFolder2Line,
  RiComputerLine,
  RiPuzzleLine,
  RiDeleteBinLine,
  RiCloudLine,
  RiArrowDownSLine,
  RiRobot2Line,
  RiFileList3Line,
  RiPlug2Line,
  RiWallet3Line,
  RiShieldUserLine,
  RiSettings4Line,
  RiAddBoxLine,
  RiShieldKeyholeLine
} from "@remixicon/react"

const flatNavItems = [
  { title: "环境管理", shortTitle: "环境", url: "/environments", icon: RiLayout4Line },
  { title: "分组管理", shortTitle: "分组", url: "/groups", icon: RiFolder2Line },
  { title: "设备管理", shortTitle: "设备", url: "/devices", icon: RiComputerLine },
  { title: "应用中心", shortTitle: "应用", url: "/apps", icon: RiPuzzleLine },
  { title: "回收站", shortTitle: "回收", url: "/trash", icon: RiDeleteBinLine },
]

const automationNavItems = [
  { title: "窗口同步", shortTitle: "同步", url: "/automation/sync", icon: RiLayout4Line },
  { title: "RPA Plus", shortTitle: "RPA", url: "/automation/rpa", icon: RiRobot2Line },
]

const teamNavItems = [
  { title: "费用中心", shortTitle: "费用", url: "/team/billing", icon: RiWallet3Line },
  { title: "成员管理", shortTitle: "成员", url: "/team/members", icon: RiShieldUserLine },
  { title: "操作日志", shortTitle: "日志", url: "/team/logs", icon: RiFileList3Line },
  { title: "访问控制", shortTitle: "访问", url: "/team/access-control", icon: RiShieldKeyholeLine },
  { title: "全局设置", shortTitle: "设置", url: "/settings", icon: RiSettings4Line },
]

const user = {
  name: "Admin Boss",
  email: "admin@joiiberry.com",
  avatar: "",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pt-4">
        {/* Logo Container */}
        <div className="flex items-center justify-center mb-4 h-8 overflow-hidden">
          {/* <Image src={logoRound} alt="Joii Berry" className="hidden group-data-[collapsible=icon]:block h-8 w-auto object-contain" /> */}
          {/* <Image src={logoWithText} alt="Joii Berry" className="block group-data-[collapsible=icon]:hidden h-8 w-auto object-contain" /> */}
          <div className="hidden group-data-[collapsible=icon]:block h-8 w-auto object-contain">
            <svg viewBox="0 0 512 512" width="w-auto" height="" fill="none">
              <g id="组合 8">
                <rect id="矩形 10" width="511.999969" height="511.999969" x="0.000000" y="0.000000" rx="255.999985" fill="var(--primary)" />
                <g xmlns="http://www.w3.org/2000/svg" id="组合 6">
                  <path id="矢量 8(边框)" d="M399.786 292.114L399.784 292.125C399.325 295.377 398.765 298.616 398.105 301.84C397.045 307.015 395.734 312.111 394.173 317.13C392.625 322.107 390.83 327.007 388.789 331.831C387.047 335.95 385.138 339.981 383.063 343.925L383.06 343.93L383.058 343.934C380.344 349.092 377.345 354.1 374.063 358.959C371.393 362.91 368.56 366.727 365.562 370.41L365.56 370.413L365.559 370.413C362.115 374.645 358.453 378.701 354.575 382.58C350.671 386.484 346.589 390.168 342.327 393.633L342.327 393.634C338.668 396.608 334.878 399.42 330.956 402.07C326.069 405.373 321.03 408.388 315.84 411.115L315.839 411.115C311.922 413.174 307.919 415.068 303.83 416.798C298.999 418.842 294.092 420.638 289.108 422.187L289.106 422.188C284.094 423.746 279.005 425.054 273.838 426.111C270.635 426.767 267.418 427.323 264.187 427.78L264.176 427.782C256.751 428.831 249.252 429.356 241.678 429.356C234.091 429.356 226.578 428.83 219.14 427.777C215.917 427.321 212.709 426.766 209.514 426.112C204.324 425.05 199.211 423.736 194.177 422.169L194.177 422.169C189.215 420.625 184.329 418.836 179.519 416.801C175.405 415.061 171.377 413.155 167.437 411.082C162.271 408.365 157.255 405.363 152.39 402.076C148.449 399.414 144.642 396.588 140.967 393.599L140.962 393.595C136.72 390.144 132.656 386.475 128.769 382.587C124.882 378.701 121.214 374.638 117.763 370.397L117.762 370.395C114.771 366.719 111.944 362.909 109.28 358.967C105.994 354.103 102.993 349.089 100.277 343.926C98.2037 339.983 96.2962 335.954 94.5548 331.837C92.5199 327.026 90.7302 322.138 89.1857 317.175C87.6197 312.142 86.3058 307.031 85.2439 301.842C84.5907 298.65 84.0362 295.445 83.5804 292.225L83.5803 292.225C82.5268 284.784 82 277.268 82 269.678C82 262.088 82.5267 254.573 83.5802 247.132C84.0361 243.912 84.5907 240.706 85.2439 237.514C86.3061 232.323 87.6205 227.211 89.1872 222.177C90.7314 217.215 92.5206 212.329 94.5548 207.519C96.2965 203.402 98.2042 199.372 100.278 195.429C102.994 190.266 105.994 185.253 109.28 180.39C111.943 176.448 114.769 172.64 117.759 168.965L117.759 168.965L117.759 168.965C121.211 164.722 124.881 160.657 128.769 156.769C132.656 152.881 136.722 149.211 140.964 145.76L140.964 145.76C144.64 142.769 148.448 139.943 152.39 137.28C157.253 133.994 162.266 130.994 167.429 128.278C171.372 126.204 175.402 124.296 179.519 122.555C184.329 120.52 189.216 118.731 194.178 117.187L194.179 117.187C199.212 115.62 204.324 114.306 209.514 113.244C212.706 112.591 215.913 112.036 219.133 111.58C226.573 110.527 234.088 110 241.678 110L401.356 110L401.356 269.701C401.353 277.246 400.83 284.717 399.786 292.114ZM241.678 187.391C235.274 187.391 229.05 188.091 223.007 189.491L222.767 189.547C218.318 190.592 213.951 192.02 209.666 193.832C205.187 195.727 200.944 197.975 196.937 200.576C192.13 203.697 187.649 207.335 183.494 211.491C179.335 215.65 175.695 220.132 172.576 224.938C169.975 228.944 167.727 233.187 165.833 237.666C164.046 241.889 162.633 246.193 161.591 250.579L161.547 250.768C160.11 256.887 159.391 263.191 159.391 269.678C159.391 276.166 160.11 282.469 161.547 288.587L161.547 288.589L161.579 288.723C162.621 293.127 164.039 297.449 165.832 301.688C167.727 306.168 169.975 310.412 172.577 314.421C175.696 319.225 179.335 323.706 183.492 327.863C187.652 332.023 192.134 335.663 196.938 338.781C200.942 341.38 205.186 343.628 209.668 345.524C213.951 347.336 218.317 348.764 222.767 349.809C228.885 351.246 235.188 351.965 241.678 351.965C248.071 351.965 254.283 351.268 260.314 349.873L260.591 349.808C265.039 348.764 269.405 347.336 273.69 345.524C278.057 343.676 282.2 341.493 286.119 338.975L286.42 338.779C291.226 335.66 295.707 332.021 299.863 327.865C304.021 323.706 307.66 319.224 310.78 314.419C313.381 310.414 315.628 306.171 317.523 301.69C319.335 297.407 320.764 293.04 321.809 288.59C323.246 282.47 323.965 276.166 323.965 269.678L323.965 187.391L241.678 187.391Z" fill="rgb(255,255,255)" fill-rule="evenodd" />
                  <circle id="椭圆 6" cx="241.678238" cy="269.677246" r="54.6723785" fill="rgb(255,255,255)" />
                </g>
              </g>
            </svg>
          </div>
          <div className="block group-data-[collapsible=icon]:hidden h-8 w-auto object-contain">
            <svg viewBox="0 0 1769 314" xmlns="http://www.w3.org/2000/svg" width="w-auto" height="" >
              <g id="组合 7">
                <g id="浆果浏览器">
                  <path id="矢量 7" d="M423.843 73.9531L423.843 90.5625L354.301 119.497L372.419 163.463L423.843 142.27L423.843 164.14L466.095 164.14L466.095 83.4978L487.597 98.8296L490.078 95.4476L510.076 115.138L474.666 137.61L490.379 162.261L470.681 162.261L470.681 269.358L442.639 269.358L442.639 313.699L513.459 313.699L513.459 244.481L590.445 314L621.57 279.579L557.515 221.709L605.255 187.213L577.514 148.733L517.519 192.098L513.459 188.415L513.459 162.562L496.844 162.562L613.601 88.0823L613.601 23.7492L541.502 23.7492L543.381 20.9684L514.136 0L466.095 67.4897L466.095 5.26089L423.843 5.26089L423.843 73.5773L400.161 15.7075L363.247 31.1144L387.23 89.2848L423.843 73.9531ZM516.542 66.8133L572.025 66.8133L572.025 75.4562L543.381 93.9445L516.542 66.8133ZM354 277.7L381.065 308.514L458.351 240.423L458.351 178.57L370.615 178.57L370.615 220.431L417.077 220.431L417.077 222.31L354 277.7Z" fill="var(--primary)" fill-rule="evenodd" />
                  <path id="矢量 8" d="M904.612 255.83L820.484 213.667L894.086 213.667L894.086 167.823L793.719 167.823L793.719 151.814L877.471 151.814L877.471 109.953L877.17 109.953L877.17 96.7254L877.471 96.7254L877.471 67.7905L877.17 67.7905L877.17 52.9849L877.471 52.9849L877.471 7.74121L667.189 7.74121L667.189 151.814L749.663 151.814L749.663 168.123L650.499 168.123L650.499 213.667L732.747 213.667L640.951 258.911L662.227 302.351L749.663 259.212L749.663 306.334L793.719 306.334L793.719 257.408L881.456 301.75L904.612 255.83ZM749.663 67.7905L711.17 67.7905L711.17 53.2855L749.663 53.2855L749.663 67.7905ZM793.719 53.2855L833.114 53.2855L833.114 67.7905L793.719 67.7905L793.719 53.2855ZM749.663 96.7254L749.663 109.953L711.17 109.953L711.17 96.7254L749.663 96.7254ZM793.719 96.7254L833.114 96.7254L833.114 109.953L793.719 109.953L793.719 96.7254Z" fill="var(--primary)" fill-rule="evenodd" />
                  <path id="矢量 9" d="M1065.63 40.6593L1067.14 3.75795L1025.26 2.17969L1023.76 40.6593L1005.57 40.6593L1005.57 94.2453L1045.34 94.2453L1039.47 123.781L1035.49 115.439L998.498 134.228L1026.54 188.716L1003.08 303.854L1041.95 311.896L1055.18 245.083L1071.5 276.798L1108.11 258.009L1068.42 180.148L1085.93 94.2453L1089.02 94.2453L1089.02 40.6593L1065.63 40.6593ZM1184.2 3.08155L1144.8 3.08155L1144.8 254.928L1122.92 254.928L1122.92 309.115L1184.2 309.115L1184.2 3.08155ZM968.651 4.3592L940.308 53.2855L980.981 76.6589L1009.25 28.0332L968.651 4.3592ZM1132.77 26.2295L1099.47 26.2295L1099.47 231.855L1132.77 231.855L1132.77 26.2295ZM968.952 79.7402L931.061 128.065L969.553 158.278L1007.44 109.953L968.952 79.7402ZM960.005 173.985L935.346 296.489L976.921 304.831L1001.88 182.252L960.005 173.985Z" fill="var(--primary)" fill-rule="evenodd" />
                  <path id="矢量 10" d="M1453.63 306.936L1468.44 234.636L1434.83 227.196L1434.83 124.683L1417.32 124.683L1446.26 104.692L1422.8 70.8719L1462.58 70.8719L1462.58 24.6512L1397.32 24.6512L1400.33 15.4071L1357.25 0.375977L1326.8 87.1807L1326.8 4.65984L1280.86 4.65984L1280.86 113.335L1326.8 113.335L1326.8 101.009L1365.59 114.537L1381.3 70.8719L1412.35 70.8719L1383.11 91.1639L1406.19 124.683L1238.99 124.683L1238.99 230.878L1271.92 230.878L1216.51 279.278L1246.35 313.7L1329.2 241.701L1329.2 306.936L1453.63 306.936ZM1220.87 112.057L1264.25 112.057L1264.25 12.6263L1220.87 12.6263L1220.87 112.057ZM1388.37 173.008L1388.37 231.254L1421 231.254L1414.54 261.692L1371.38 261.692L1371.38 216.448L1358.45 216.448L1367.4 208.407L1337.55 173.985L1284.25 220.432L1284.25 173.008L1388.37 173.008Z" fill="var(--primary)" fill-rule="evenodd" />
                  <path id="矢量 11" d="M1525.71 169.626L1485.34 212.164L1521.05 245.683L1522.33 244.481L1522.33 305.432L1622.1 305.432L1622.1 198.561L1565.41 198.561L1592.85 169.626L1651.64 169.626L1688.93 198.561L1637.51 198.561L1637.51 305.432L1738.48 305.432L1738.48 237.041L1746.15 242.903L1769 213.367L1712.61 169.626L1754.49 169.626L1754.49 126.261L1724.34 126.261L1719.08 106.27L1744.94 106.27L1744.94 8.94336L1637.81 8.94336L1637.81 106.27L1677.2 106.27L1682.47 126.562L1633.75 126.562L1642.4 117.017L1621.8 97.6269L1621.8 8.94336L1515.56 8.94336L1515.56 106.27L1585.41 106.27L1566.31 126.562L1505.72 126.562L1505.72 169.626L1525.71 169.626ZM1556.16 48.7007L1581.42 48.7007L1581.42 69.2933L1556.16 69.2933L1556.16 48.7007ZM1704.65 69.2933L1678.71 69.2933L1678.71 48.7007L1704.65 48.7007L1704.65 69.2933ZM1560.82 237.717L1583.9 237.717L1583.9 266.351L1560.82 266.351L1560.82 237.717ZM1676 237.717L1699.08 237.717L1699.08 266.351L1676 266.351L1676 237.717Z" fill="var(--primary)" fill-rule="evenodd" />
                </g>
                <g id="组合 6">
                  <path id="矢量 8(边框)" fill="var(--primary)" fill-rule="evenodd" d="M308.476 180.779L308.474 180.789C308.028 183.946 307.485 187.09 306.844 190.22C305.815 195.243 304.543 200.19 303.027 205.062C301.524 209.893 299.782 214.65 297.801 219.332C296.11 223.33 294.257 227.243 292.242 231.071L292.24 231.077L292.238 231.08C289.603 236.087 286.693 240.949 283.506 245.665C280.915 249.5 278.164 253.206 275.254 256.781L275.252 256.784L275.252 256.784C271.908 260.892 268.354 264.829 264.589 268.594C260.8 272.384 256.837 275.96 252.7 279.323L252.7 279.324C249.149 282.211 245.47 284.941 241.663 287.514C236.918 290.719 232.027 293.646 226.989 296.293L226.989 296.294C223.186 298.292 219.3 300.13 215.331 301.81C210.642 303.794 205.879 305.537 201.041 307.041L201.038 307.042C196.174 308.554 191.234 309.823 186.218 310.85C183.109 311.487 179.986 312.027 176.849 312.47L176.839 312.472C169.631 313.491 162.352 314 155 314C147.635 314 140.342 313.489 133.122 312.467C129.994 312.024 126.879 311.486 123.778 310.851C118.74 309.82 113.777 308.544 108.891 307.024L108.89 307.023C104.074 305.524 99.3309 303.788 94.6624 301.813C90.6682 300.124 86.7587 298.273 82.934 296.262C77.9195 293.624 73.0506 290.71 68.3274 287.519C64.5024 284.935 60.8066 282.192 57.2399 279.291L57.235 279.287C53.1173 275.937 49.1719 272.375 45.3985 268.601C41.6261 264.829 38.0652 260.885 34.7157 256.768L34.7146 256.767C31.811 253.198 29.0664 249.5 26.4808 245.673C23.2911 240.951 20.3782 236.085 17.7418 231.072C15.729 227.246 13.8774 223.334 12.187 219.338C10.2117 214.668 8.47445 209.923 6.97516 205.105C5.45506 200.22 4.17962 195.259 3.14883 190.222C2.51484 187.123 1.97659 184.012 1.53408 180.886L1.53403 180.886C0.511345 173.663 9.18134e-07 166.368 0 159C0 151.633 0.511308 144.337 1.53392 137.115C1.97647 133.989 2.51477 130.877 3.14883 127.778C4.17995 122.74 5.45587 117.777 6.9766 112.89C8.47557 108.074 10.2124 103.331 12.187 98.6624C13.8776 94.6654 15.7295 90.7532 17.7427 86.9259C20.3788 81.9142 23.2915 77.0481 26.4808 72.3274C29.0654 68.5017 31.8088 64.8052 34.711 61.2379L34.7112 61.2377L34.7113 61.2375C38.062 57.1189 41.6244 53.1726 45.3985 49.3985C49.1724 45.6247 53.1185 42.0625 57.2367 38.7119L57.2368 38.7119C60.8044 35.8093 64.5013 33.0656 68.3274 30.4808C73.0483 27.2914 77.9147 24.3785 82.9266 21.7423C86.7537 19.7293 90.6656 17.8775 94.6624 16.187C99.3314 14.2122 104.075 12.4752 108.892 10.9761L108.892 10.976C113.778 9.45555 118.74 8.17982 123.778 7.14883C126.877 6.51475 129.989 5.97643 133.115 5.53388C140.338 4.51129 147.633 4 155 4L310 4L310 159.023C309.997 166.346 309.489 173.598 308.476 180.779ZM155 79.1237C148.783 79.1237 142.742 79.8031 136.876 81.1619L136.643 81.2167C132.325 82.2307 128.086 83.6173 123.926 85.3763C119.578 87.2154 115.459 89.3976 111.569 91.9228C106.904 94.9515 102.554 98.4833 98.5202 102.518C94.4829 106.555 90.9502 110.906 87.922 115.57C85.3974 119.459 83.2157 123.578 81.3769 127.926C79.6427 132.025 78.2702 136.203 77.2597 140.46L77.2165 140.644C75.8213 146.584 75.1237 152.703 75.1237 159C75.1237 165.298 75.8213 171.416 77.2164 177.355L77.2168 177.357L77.2473 177.487C78.2589 181.762 79.6352 185.957 81.376 190.072C83.2155 194.421 85.3979 198.541 87.9234 202.432C90.9514 207.096 94.4832 211.445 98.5186 215.48C102.557 219.519 106.908 223.052 111.57 226.078C115.458 228.602 119.577 230.784 123.928 232.624C128.085 234.383 132.324 235.769 136.643 236.784C142.581 238.179 148.7 238.876 155 238.876C161.205 238.876 167.235 238.199 173.09 236.846L173.358 236.783C177.676 235.769 181.915 234.383 186.074 232.624C190.313 230.83 194.335 228.711 198.139 226.266L198.431 226.077C203.096 223.048 207.446 219.517 211.48 215.482C215.516 211.445 219.049 207.095 222.077 202.43C224.602 198.542 226.784 194.423 228.623 190.074C230.382 185.917 231.769 181.678 232.783 177.358C234.179 171.417 234.876 165.298 234.876 159L234.876 79.1237L155 79.1237Z" />
                  <path id="椭圆 6" fill="var(--primary)" fill-rule="evenodd" d="M101.93 159C101.93 129.69 125.69 105.93 155 105.93C184.31 105.93 208.071 129.69 208.071 159C208.071 188.31 184.31 212.071 155 212.071C125.69 212.071 101.93 188.31 101.93 159Z" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* 新建浏览器 Button */}
        <ButtonGroup className="w-full group-data-[collapsible=icon]:hidden shadow-md shadow-primary/20 rounded-md">
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-10 font-normal shadow-none border border-primary/50">
            <Link href="/create">新建环境</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-2 h-10 shadow-none border border-primary/50">
            <Link href="/create">
              <RiAddBoxLine className="h-5 w-5" />
            </Link>
          </Button>
        </ButtonGroup>
        {/* Icon mode New Browser Button */}
        <Button asChild className="hidden group-data-[collapsible=icon]:flex size-10 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 mb-2 shrink-0 self-center">
          <Link href="/create">
            <RiAddBoxLine className="h-5 w-5" />
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
        {/* Flat Primary Nav */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarMenu>
            {flatNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url || (pathname === '/' && item.url === '/environments')}
                  className="h-9 text-sm group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:justify-center"
                  tooltip={item.title}
                >
                  <Link href={item.url} className="flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1">
                    <item.icon className="!size-5 shrink-0" />
                    <span className="ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                    <span className="hidden group-data-[collapsible=icon]:block text-[10px] leading-none text-neutral-500 font-normal">{item.shortTitle}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Automation Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sm font-normal text-muted-foreground hover:bg-muted cursor-pointer flex items-center justify-between mb-1 group-data-[collapsible=icon]:hidden">
                自动化
                <RiArrowDownSLine className="size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent className="group-data-[collapsible=icon]:!hidden">
              <SidebarMenu>
                {automationNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="h-9 text-sm" tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon className="!size-5 shrink-0" />
                        <span className="ml-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
            {/* Fallback for icon mode (Automation items shown as flat in icon mode) */}
            <div className="hidden group-data-[collapsible=icon]:block group-data-[collapsible=icon]:mt-2">
              <SidebarMenu>
                {automationNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="h-9 text-sm mb-1 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:justify-center"
                      tooltip={item.title}
                    >
                      <Link href={item.url} className="flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1">
                        <item.icon className="!size-5 shrink-0" />
                        <span className="ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                        <span className="hidden group-data-[collapsible=icon]:block text-[10px] leading-none text-neutral-500 font-normal">{item.shortTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </Collapsible>
        </SidebarGroup>

        {/* Team Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sm font-normal text-muted-foreground hover:bg-muted cursor-pointer flex items-center justify-between mb-1 group-data-[collapsible=icon]:hidden">
                团队
                <RiArrowDownSLine className="size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent className="group-data-[collapsible=icon]:!hidden">
              <SidebarMenu>
                {teamNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="h-9 text-sm" tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon className="!size-5 shrink-0" />
                        <span className="ml-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
            {/* Fallback for icon mode (Team items shown as flat in icon mode) */}
            <div className="hidden group-data-[collapsible=icon]:block group-data-[collapsible=icon]:mt-2">
              <SidebarMenu>
                {teamNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="h-9 text-sm mb-1 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:justify-center"
                      tooltip={item.title}
                    >
                      <Link href={item.url} className="flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1">
                        <item.icon className="!size-5 shrink-0" />
                        <span className="ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                        <span className="hidden group-data-[collapsible=icon]:block text-[10px] leading-none text-neutral-500 font-normal">{item.shortTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </Collapsible>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
