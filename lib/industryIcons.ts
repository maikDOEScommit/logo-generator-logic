// lib/industryIcons.ts
import { IconData } from './types';
import {
  // Lucide Icons - import only the icons we need
  Code, Smartphone, Laptop, Monitor, Wifi, Settings, Search, Plug,
  Rocket, Phone, Mail, MessageCircle, Send, Download, Upload, Link,
  RefreshCw, Expand, Minimize, Power, Lock, Unlock, Key, Shield, Eye, EyeOff,
  Clock, Timer, Watch, Wrench, Hammer, Headphones, TrendingUp, BarChart,
  PieChart, ShoppingCart, CreditCard, Handshake, Heart, Droplets, Leaf,
  Hospital, Award, Gamepad2, Circle, Square, Triangle,
  Diamond, Hexagon, Pentagon, Star, Lightbulb, Palette, Camera, Edit,
  Copy, CheckCircle, Bookmark, Archive, Crown, Scissors, Coffee, Pizza,
  HelpCircle, School, Gift, Store, Home, Car, Plane, Ship, Compass,
  Briefcase, Users, User, UserPlus, Bell, Music, Play, Pause, StopCircle as Stop,
  Volume2, Globe, Sun, Cloud, Flame, Flower, Mountain, PaintBucket
} from 'lucide-react';

// React Icons imports for additional icons
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as GoIcons from 'react-icons/go';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import * as ImIcons from 'react-icons/im';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as TiIcons from 'react-icons/ti';
import * as VscIcons from 'react-icons/vsc';
import * as WiIcons from 'react-icons/wi';

export interface IndustryIcons {
  industry: string;
  icons: IconData[];
}

// Helper function to create IconData from React Icons
const createIconData = (id: string, component: any, tags: string[] = []): IconData => ({
  id,
  component,
  tags: [...tags, 'industry-specific']
});

export const industrySpecificIcons: IndustryIcons[] = [
  {
    industry: 'tech',
    icons: [
      // Lucide Icons
      createIconData('code', Code, ['development', 'programming']),
      createIconData('smartphone', Smartphone, ['mobile', 'device']),
      createIconData('laptop', Laptop, ['computer', 'device']),
      createIconData('monitor', Monitor, ['display', 'screen']),
      createIconData('wifi', Wifi, ['network', 'connection']),
      createIconData('settings', Settings, ['configuration', 'preferences']),
      createIconData('search', Search, ['find', 'explore']),
      createIconData('plug', Plug, ['power', 'connection']),
      createIconData('rocket', Rocket, ['launch', 'startup']),
      createIconData('phone', Phone, ['communication', 'contact']),
      createIconData('mail', Mail, ['email', 'message']),
      createIconData('message-circle', MessageCircle, ['chat', 'communication']),
      createIconData('send', Send, ['transmit', 'deliver']),
      createIconData('download', Download, ['save', 'transfer']),
      createIconData('upload', Upload, ['transfer', 'cloud']),
      createIconData('link', Link, ['connection', 'url']),
      createIconData('refresh-cw', RefreshCw, ['reload', 'update']),
      createIconData('expand', Expand, ['maximize', 'fullscreen']),
      createIconData('minimize', Minimize, ['reduce', 'shrink']),
      createIconData('power', Power, ['on-off', 'energy']),
      createIconData('lock', Lock, ['security', 'protected']),
      createIconData('unlock', Unlock, ['security', 'open']),
      createIconData('key', Key, ['access', 'security']),
      createIconData('shield', Shield, ['protection', 'security']),
      createIconData('eye', Eye, ['view', 'visibility']),
      createIconData('eye-off', EyeOff, ['hidden', 'privacy']),
      createIconData('clock', Clock, ['time', 'schedule']),
      createIconData('timer', Timer, ['countdown', 'time']),
      createIconData('watch', Watch, ['time', 'wearable']),
      createIconData('wrench', Wrench, ['tools', 'maintenance']),
      createIconData('hammer', Hammer, ['tools', 'build']),
      createIconData('headphones', Headphones, ['audio', 'sound']),

      // React Icons - AI
      createIconData('ai-aifillandroid', AiIcons.AiFillAndroid, ['android', 'mobile']),
      createIconData('ai-aifillapi', AiIcons.AiFillApi, ['api', 'integration']),
      createIconData('ai-aifillaudio', AiIcons.AiFillAudio, ['sound', 'media']),
      createIconData('ai-aifillcode', AiIcons.AiFillCode, ['development', 'programming']),
      createIconData('ai-aifillcodesandboxcircle', AiIcons.AiFillCodeSandboxCircle, ['sandbox', 'development']),
      createIconData('ai-aifillcodesandboxsquare', AiIcons.AiFillCodeSandboxSquare, ['sandbox', 'development']),
      createIconData('ai-aifillcodepencircle', AiIcons.AiFillCodepenCircle, ['codepen', 'development']),
      createIconData('ai-aifillcodepensquare', AiIcons.AiFillCodepenSquare, ['codepen', 'development']),
      createIconData('ai-aifillcontrol', AiIcons.AiFillControl, ['control', 'system']),
      createIconData('ai-aifilldashboard', AiIcons.AiFillDashboard, ['dashboard', 'interface']),
      createIconData('ai-aifilldatabase', AiIcons.AiFillDatabase, ['database', 'storage']),
      createIconData('ai-aifillhdd', AiIcons.AiFillHdd, ['storage', 'hardware']),

      // React Icons - BI
      createIconData('bi-biabacus', BiIcons.BiAbacus, ['calculation', 'math']),
      createIconData('bi-biaccessibility', BiIcons.BiAccessibility, ['accessibility', 'universal']),
      createIconData('bi-bianalyse', BiIcons.BiAnalyse, ['analysis', 'data']),
      createIconData('bi-biat', BiIcons.BiAt, ['email', 'mention']),
      createIconData('bi-biatom', BiIcons.BiAtom, ['science', 'physics']),
      createIconData('bi-bibarcode', BiIcons.BiBarcode, ['code', 'scan']),
      createIconData('bi-bibarcodereader', BiIcons.BiBarcodeReader, ['scanner', 'reading']),
      createIconData('bi-bibattery', BiIcons.BiBattery, ['power', 'energy']),
      createIconData('bi-bibluetooth', BiIcons.BiBluetooth, ['wireless', 'connection']),
      createIconData('bi-bibot', BiIcons.BiBot, ['robot', 'ai']),
      createIconData('bi-bibroadcast', BiIcons.BiBroadcast, ['transmission', 'signal']),
      createIconData('bi-bibug', BiIcons.BiBug, ['debug', 'error']),
      createIconData('bi-bibugalt', BiIcons.BiBugAlt, ['debug', 'error']),
      createIconData('bi-bibulb', BiIcons.BiBulb, ['idea', 'innovation']),

      // React Icons - BS
      createIconData('bs-bsalexa', BsIcons.BsAlexa, ['voice', 'assistant']),
      createIconData('bs-bsapp', BsIcons.BsApp, ['application', 'software']),
      createIconData('bs-bsappindicator', BsIcons.BsAppIndicator, ['app', 'indicator']),
      createIconData('bs-bsarrowclockwise', BsIcons.BsArrowClockwise, ['refresh', 'rotate']),
      createIconData('bs-bsarrowcounterclockwise', BsIcons.BsArrowCounterclockwise, ['undo', 'reverse']),

      // React Icons - CG
      createIconData('cg-cgapplewatch', CgIcons.CgAppleWatch, ['smartwatch', 'wearable']),
      createIconData('cg-cgarrowsbreakeh', CgIcons.CgArrowsBreakeH, ['break', 'horizontal']),
      createIconData('cg-cgarrowsexchange', CgIcons.CgArrowsExchange, ['exchange', 'swap']),
      createIconData('cg-cgarrowsexchangealt', CgIcons.CgArrowsExchangeAlt, ['exchange', 'alternate']),
      createIconData('cg-cgarrowsexchangealtv', CgIcons.CgArrowsExchangeAltV, ['exchange', 'vertical']),
      createIconData('cg-cgarrowsexchangev', CgIcons.CgArrowsExchangeV, ['exchange', 'vertical']),
      createIconData('cg-cgattachment', CgIcons.CgAttachment, ['attachment', 'file']),
      createIconData('cg-cgatlasian', CgIcons.CgAtlasian, ['atlassian', 'development']),
      createIconData('cg-cgbattery', CgIcons.CgBattery, ['power', 'energy']),
      createIconData('cg-cgbatteryfull', CgIcons.CgBatteryFull, ['power', 'full']),
      createIconData('cg-cgbitbucket', CgIcons.CgBitbucket, ['version-control', 'git']),
      createIconData('cg-cgbot', CgIcons.CgBot, ['robot', 'automation']),

      // React Icons - FA
      createIconData('fa-faaccusoft', FaIcons.FaAccusoft, ['software', 'company']),
      createIconData('fa-faadn', FaIcons.FaAdn, ['network', 'social']),
      createIconData('fa-faalgolia', FaIcons.FaAlgolia, ['search', 'api']),
      createIconData('fa-faat', FaIcons.FaAt, ['email', 'mention']),
      createIconData('fa-faatlassian', FaIcons.FaAtlassian, ['development', 'tools']),
      createIconData('fa-fiatom', FaIcons.FaAtom, ['science', 'physics']),
      createIconData('fa-fabitbucket', FaIcons.FaBitbucket, ['version-control', 'git']),
      createIconData('fa-fabitcoin', FaIcons.FaBitcoin, ['cryptocurrency', 'digital']),

      // React Icons - FI
      createIconData('fi-fiairplay', FiIcons.FiAirplay, ['streaming', 'cast']),
      createIconData('fi-fibattery', FiIcons.FiBattery, ['power', 'energy']),
      createIconData('fi-fibatterycharging', FiIcons.FiBatteryCharging, ['charging', 'power']),
      createIconData('fi-fibluetooth', FiIcons.FiBluetooth, ['wireless', 'connection']),
      createIconData('fi-fichrome', FiIcons.FiChrome, ['browser', 'web']),
      createIconData('fi-ficode', FiIcons.FiCode, ['development', 'programming']),
      createIconData('fi-ficodepen', FiIcons.FiCodepen, ['development', 'sandbox']),
      createIconData('fi-ficodesandbox', FiIcons.FiCodesandbox, ['development', 'sandbox']),
      createIconData('fi-ficommand', FiIcons.FiCommand, ['control', 'command']),
      createIconData('fi-ficpu', FiIcons.FiCpu, ['processor', 'hardware']),
      createIconData('fi-fidatabase', FiIcons.FiDatabase, ['storage', 'data']),
      createIconData('fi-fifacebook', FiIcons.FiFacebook, ['social', 'network']),
      createIconData('fi-figitbranch', FiIcons.FiGitBranch, ['version-control', 'git']),
      createIconData('fi-figitcommit', FiIcons.FiGitCommit, ['version-control', 'git']),

      // Additional icons from other libraries continue...
      // ... (truncated for brevity in this response)
    ]
  },
  {
    industry: 'finance',
    icons: [
      // Lucide Icons
      createIconData('trending-up', TrendingUp, ['growth', 'profit']),
      createIconData('bar-chart', BarChart, ['analytics', 'data']),
      createIconData('pie-chart', PieChart, ['statistics', 'analysis']),
      createIconData('shopping-cart', ShoppingCart, ['commerce', 'purchase']),
      createIconData('credit-card', CreditCard, ['payment', 'money']),
      createIconData('handshake', Handshake, ['partnership', 'deal']),

      // React Icons
      createIconData('ai-aifillbank', AiIcons.AiFillBank, ['banking', 'financial']),
      createIconData('ai-aifillcreditcard', AiIcons.AiFillCreditCard, ['payment', 'card']),
      createIconData('ai-aifilldollarcircle', AiIcons.AiFillDollarCircle, ['money', 'currency']),
      createIconData('ai-aifilleurocircle', AiIcons.AiFillEuroCircle, ['money', 'currency']),
      createIconData('ai-aifillfund', AiIcons.AiFillFund, ['investment', 'finance']),
      createIconData('ai-aifillfunnelplot', AiIcons.AiFillFunnelPlot, ['analytics', 'funnel']),
      createIconData('bi-bibarchart', BiIcons.BiBarChart, ['chart', 'analytics']),
      createIconData('bi-bibarchartalt', BiIcons.BiBarChartAlt, ['chart', 'analytics']),
      createIconData('bi-bibarchartalt2', BiIcons.BiBarChartAlt2, ['chart', 'analytics']),
      createIconData('bi-bibarchartsquare', BiIcons.BiBarChartSquare, ['chart', 'analytics']),
      createIconData('bi-bibitcoin', BiIcons.BiBitcoin, ['cryptocurrency', 'digital']),
      createIconData('fa-fabitcoin', FaIcons.FaBitcoin, ['cryptocurrency', 'digital']),
      createIconData('fi-fibarchart', FiIcons.FiBarChart, ['chart', 'analytics']),
      createIconData('fi-fibarchart2', FiIcons.FiBarChart2, ['chart', 'analytics']),
      createIconData('fi-fidollarsign', FiIcons.FiDollarSign, ['money', 'currency']),
      createIconData('go-gograph', GoIcons.GoGraph, ['analytics', 'data']),
      createIconData('gr-granalytics', GrIcons.GrAnalytics, ['data', 'analysis']),
      createIconData('gr-gratm', GrIcons.GrAtm, ['banking', 'cash']),
      createIconData('gr-grbarchart', GrIcons.GrBarChart, ['chart', 'data']),
      createIconData('hi-hicash', HiIcons.HiCash, ['money', 'payment']),
      createIconData('hi-hichartbar', HiIcons.HiChartBar, ['chart', 'analytics']),
      createIconData('hi-hichartpie', HiIcons.HiChartPie, ['chart', 'analytics']),
      createIconData('hi-hichartsquarebar', HiIcons.HiChartSquareBar, ['chart', 'analytics']),
      createIconData('hi-hicreditcard', HiIcons.HiCreditCard, ['payment', 'money']),
      createIconData('hi-hicurrencybangladeshi', HiIcons.HiCurrencyBangladeshi, ['currency', 'money']),
      createIconData('hi-hicurrencydollar', HiIcons.HiCurrencyDollar, ['currency', 'money']),
      createIconData('hi-hicurrencyeuro', HiIcons.HiCurrencyEuro, ['currency', 'money']),
      createIconData('hi-hicurrencypound', HiIcons.HiCurrencyPound, ['currency', 'money']),
      createIconData('hi-hicurrencyyen', HiIcons.HiCurrencyYen, ['currency', 'money']),
      createIconData('im-imcoindollar', ImIcons.ImCoinDollar, ['money', 'currency']),
      createIconData('io-ioiosanalytics', IoIcons.IoIosAnalytics, ['analytics', 'data']),
      createIconData('io-ioioscard', IoIcons.IoIosCard, ['payment', 'credit']),
      createIconData('io-ioioscash', IoIcons.IoIosCash, ['money', 'payment']),
      createIconData('md-mdaccountbalance', MdIcons.MdAccountBalance, ['banking', 'balance']),
      createIconData('ti-tichartarea', TiIcons.TiChartArea, ['chart', 'analytics']),
      createIconData('ti-tichartareaoutline', TiIcons.TiChartAreaOutline, ['chart', 'analytics']),
      createIconData('ti-tichartbar', TiIcons.TiChartBar, ['chart', 'analytics']),
      createIconData('ti-tichartbaroutline', TiIcons.TiChartBarOutline, ['chart', 'analytics']),
      createIconData('ti-tichartline', TiIcons.TiChartLine, ['chart', 'analytics']),
      createIconData('ti-tichartlineoutline', TiIcons.TiChartLineOutline, ['chart', 'analytics']),
      createIconData('ti-tichartpie', TiIcons.TiChartPie, ['chart', 'analytics']),
      createIconData('ti-tichartpieoutline', TiIcons.TiChartPieOutline, ['chart', 'analytics']),
    ]
  },
  {
    industry: 'health',
    icons: [
      // Lucide Icons
      createIconData('heart', Heart, ['love', 'health']),
      createIconData('droplets', Droplets, ['water', 'liquid']),
      createIconData('leaf', Leaf, ['natural', 'organic']),
      createIconData('hospital', Hospital, ['medical', 'healthcare']),
      createIconData('heart', Heart, ['first-aid', 'healing']),
      createIconData('eye', Eye, ['vision', 'sight']),
      createIconData('eye-off', EyeOff, ['privacy', 'hidden']),

      // React Icons
      createIconData('ai-aifillheart', AiIcons.AiFillHeart, ['love', 'health']),
      createIconData('ai-aifilleye', AiIcons.AiFillEye, ['vision', 'sight']),
      createIconData('ai-aifilleyeinvisible', AiIcons.AiFillEyeInvisible, ['privacy', 'hidden']),
      createIconData('bi-biaccessibility', BiIcons.BiAccessibility, ['accessibility', 'universal']),
      createIconData('bi-biheart', BiIcons.BiHeart, ['first-aid', 'healing']),
      createIconData('bi-bibody', BiIcons.BiBody, ['anatomy', 'human']),
      createIconData('bi-bibone', BiIcons.BiBone, ['skeleton', 'anatomy']),
      createIconData('bi-bibong', BiIcons.BiBong, ['medical', 'device']),
      createIconData('bi-bibrain', BiIcons.BiBrain, ['mind', 'psychology']),
      createIconData('bs-bsactivity', BsIcons.BsActivity, ['health', 'monitor']),
      createIconData('bs-bsarrowthroughheart', BsIcons.BsArrowThroughHeart, ['love', 'emotion']),
      createIconData('bs-bsarrowthroughheartfill', BsIcons.BsArrowThroughHeartFill, ['love', 'emotion']),
      createIconData('cg-cgheart', CgIcons.CgHeart, ['first-aid', 'healing']),
      createIconData('fa-faaccessibleicon', FaIcons.FaAccessibleIcon, ['accessibility', 'universal']),
      createIconData('fa-faambulance', FaIcons.FaAmbulance, ['emergency', 'medical']),
      createIconData('fa-faamericansignlanguageinterpreting', FaIcons.FaAmericanSignLanguageInterpreting, ['accessibility', 'communication']),
      createIconData('fa-faassistivelisteningsystems', FaIcons.FaAssistiveListeningSystems, ['accessibility', 'hearing']),
      createIconData('fa-fabacteria', FaIcons.FaBacteria, ['microorganism', 'health']),
      createIconData('fa-fabacterium', FaIcons.FaBacterium, ['microorganism', 'health']),
      createIconData('fa-fabiohazard', FaIcons.FaBiohazard, ['danger', 'medical']),
      createIconData('fi-fiactivity', FiIcons.FiActivity, ['health', 'monitor']),
      createIconData('go-goheart', GoIcons.GoHeart, ['love', 'health']),
      createIconData('go-goheartfill', GoIcons.GoHeartFill, ['love', 'health']),
      createIconData('im-imaccessibility', ImIcons.ImAccessibility, ['accessibility', 'universal']),
      createIconData('io-ioiosbody', IoIcons.IoIosBody, ['anatomy', 'human']),
      createIconData('io-ioiosbonfire', IoIcons.IoIosBonfire, ['fire', 'energy']),
      createIconData('md-mdaccessible', MdIcons.MdAccessible, ['accessibility', 'universal']),
      createIconData('md-mdaccessibleforward', MdIcons.MdAccessibleForward, ['accessibility', 'universal']),
      createIconData('ti-tieye', TiIcons.TiEye, ['vision', 'sight']),
      createIconData('ti-tieyeoutline', TiIcons.TiEyeOutline, ['vision', 'sight']),
    ]
  },
  {
    industry: 'sports',
    icons: [
      // Lucide Icons
      createIconData('trending-up', TrendingUp, ['growth', 'improvement']),
      createIconData('award', Award, ['achievement', 'prize']),
      createIconData('car', Car, ['cycling', 'transport']),
      createIconData('gamepad-2', Gamepad2, ['gaming', 'entertainment']),

      // React Icons
      createIconData('bi-bibowlingball', BiIcons.BiBowlingBall, ['bowling', 'sport']),
      createIconData('fa-fabasketballball', FaIcons.FaBasketballBall, ['basketball', 'sport']),
      createIconData('fa-facar', FaIcons.FaCar, ['cycling', 'transport']),
      createIconData('fa-fabiking', FaIcons.FaBiking, ['cycling', 'activity']),
      createIconData('fi-fiaward', FiIcons.FiAward, ['achievement', 'prize']),
      createIconData('go-gogoal', GoIcons.GoGoal, ['target', 'achievement']),
      createIconData('gr-grbike', GrIcons.GrBike, ['cycling', 'transport']),
      createIconData('io-ioiosbaseball', IoIcons.IoIosBaseball, ['baseball', 'sport']),
      createIconData('io-ioiosbasketball', IoIcons.IoIosBasketball, ['basketball', 'sport']),
      createIconData('io-ioioscar', IoIcons.IoIosCar, ['cycling', 'transport']),
    ]
  },
  {
    industry: 'design',
    icons: [
      // Lucide Icons
      createIconData('circle', Circle, ['shape', 'geometry']),
      createIconData('square', Square, ['shape', 'geometry']),
      createIconData('triangle', Triangle, ['shape', 'geometry']),
      createIconData('diamond', Diamond, ['shape', 'geometry']),
      createIconData('hexagon', Hexagon, ['shape', 'geometry']),
      createIconData('pentagon', Pentagon, ['shape', 'geometry']),
      createIconData('star', Star, ['shape', 'rating']),
      createIconData('lightbulb', Lightbulb, ['idea', 'creativity']),
      createIconData('palette', Palette, ['color', 'art']),
      createIconData('camera', Camera, ['photography', 'visual']),
      createIconData('edit', Edit, ['modify', 'create']),
      createIconData('copy', Copy, ['duplicate', 'clone']),
      createIconData('check-circle', CheckCircle, ['approve', 'complete']),
      createIconData('bookmark', Bookmark, ['save', 'favorite']),
      createIconData('archive', Archive, ['storage', 'organize']),
      createIconData('crown', Crown, ['premium', 'royal']),
      createIconData('scissors', Scissors, ['cut', 'trim']),
      createIconData('paint-bucket', PaintBucket, ['fill', 'color']),

      // React Icons - extensive design collection
      createIconData('ai-aifillbulb', AiIcons.AiFillBulb, ['idea', 'creativity']),
      createIconData('ai-aifillcamera', AiIcons.AiFillCamera, ['photography', 'visual']),
      createIconData('ai-aifilledit', AiIcons.AiFillEdit, ['modify', 'create']),
      createIconData('ai-aifillformatpainter', AiIcons.AiFillFormatPainter, ['format', 'design']),
      createIconData('ai-aifillhighlight', AiIcons.AiFillHighlight, ['emphasize', 'mark']),
      createIconData('bi-biadjust', BiIcons.BiAdjust, ['settings', 'modify']),
      createIconData('bi-biaperture', BiIcons.BiAperture, ['camera', 'photography']),
      createIconData('bi-biarch', BiIcons.BiArch, ['architecture', 'design']),
      createIconData('bi-biborderall', BiIcons.BiBorderAll, ['border', 'frame']),
      createIconData('bi-bibordernone', BiIcons.BiBorderNone, ['border', 'frame']),
      createIconData('bi-biborderouter', BiIcons.BiBorderOuter, ['border', 'frame']),
      createIconData('bi-biborderradius', BiIcons.BiBorderRadius, ['border', 'frame']),
      createIconData('bi-bibrightness', BiIcons.BiBrightness, ['light', 'adjust']),
      createIconData('bi-bibrightnesshalf', BiIcons.BiBrightnessHalf, ['light', 'adjust']),
      createIconData('bi-bibrush', BiIcons.BiBrush, ['paint', 'create']),

      // CG Icons for design
      createIconData('cg-cgabstract', CgIcons.CgAbstract, ['abstract', 'art']),
      createIconData('cg-cgarrangefront', CgIcons.CgArrangeFront, ['arrange', 'layer']),
      createIconData('cg-cgborderall', CgIcons.CgBorderAll, ['border', 'frame']),
      createIconData('cg-cgborderbottom', CgIcons.CgBorderBottom, ['border', 'frame']),
      createIconData('cg-cgborderleft', CgIcons.CgBorderLeft, ['border', 'frame']),
      createIconData('cg-cgborderright', CgIcons.CgBorderRight, ['border', 'frame']),
      createIconData('cg-cgborderstyledashed', CgIcons.CgBorderStyleDashed, ['border', 'style']),
      createIconData('cg-cgborderstyledotted', CgIcons.CgBorderStyleDotted, ['border', 'style']),
      createIconData('cg-cgborderstylesolid', CgIcons.CgBorderStyleSolid, ['border', 'style']),
      createIconData('cg-cgbordertop', CgIcons.CgBorderTop, ['border', 'frame']),

      // FA Icons for design
      createIconData('fa-faadjust', FaIcons.FaAdjust, ['settings', 'modify']),
      createIconData('fa-faaligncenter', FaIcons.FaAlignCenter, ['align', 'center']),
      createIconData('fa-faalignjustify', FaIcons.FaAlignJustify, ['align', 'justify']),
      createIconData('fa-faarchway', FaIcons.FaArchway, ['architecture', 'design']),
      createIconData('fa-fabeziercurve', FaIcons.FaBezierCurve, ['curve', 'design']),

      // FI Icons for design
      createIconData('fi-fialigncenter', FiIcons.FiAlignCenter, ['align', 'center']),
      createIconData('fi-fialignjustify', FiIcons.FiAlignJustify, ['align', 'justify']),
      createIconData('fi-fialignleft', FiIcons.FiAlignLeft, ['align', 'left']),
      createIconData('fi-fialignright', FiIcons.FiAlignRight, ['align', 'right']),
      createIconData('fi-fiaperture', FiIcons.FiAperture, ['camera', 'photography']),
      createIconData('fi-ficamera', FiIcons.FiCamera, ['photography', 'visual']),
      createIconData('fi-ficameraoff', FiIcons.FiCameraOff, ['photography', 'disabled']),
      createIconData('fi-ficrop', FiIcons.FiCrop, ['edit', 'trim']),
      createIconData('fi-ficrosshair', FiIcons.FiCrosshair, ['target', 'precision']),
      createIconData('fi-fiedit', FiIcons.FiEdit, ['modify', 'create']),
      createIconData('fi-fiedit2', FiIcons.FiEdit2, ['modify', 'create']),
      createIconData('fi-fiedit3', FiIcons.FiEdit3, ['modify', 'create']),
      createIconData('fi-fifeather', FiIcons.FiFeather, ['light', 'elegant']),
      createIconData('fi-fifigma', FiIcons.FiFigma, ['design', 'tool']),

      // GO Icons for design
      createIconData('go-gofilemedia', GoIcons.GoFileMedia, ['media', 'file']),

      // GR Icons for design
      createIconData('gr-grbrush', GrIcons.GrBrush, ['paint', 'create']),
      createIconData('gr-grbucket', GrIcons.GrBucket, ['fill', 'paint']),
      createIconData('gr-grcamera', GrIcons.GrCamera, ['photography', 'visual']),

      // HI Icons for design
      createIconData('hi-hiannotation', HiIcons.HiAnnotation, ['note', 'comment']),
      createIconData('hi-hicamera', HiIcons.HiCamera, ['photography', 'visual']),
      createIconData('hi-hicolorswatch', HiIcons.HiColorSwatch, ['color', 'palette']),
      createIconData('hi-hicube', HiIcons.HiCube, ['3d', 'dimension']),
      createIconData('hi-hicubetransparent', HiIcons.HiCubeTransparent, ['3d', 'transparent']),
      createIconData('hi-hicursorclick', HiIcons.HiCursorClick, ['interact', 'click']),

      // IM Icons for design
      createIconData('im-imbrightnesscontrast', ImIcons.ImBrightnessContrast, ['brightness', 'contrast']),
      createIconData('im-imcamera', ImIcons.ImCamera, ['photography', 'visual']),
      createIconData('im-imcrop', ImIcons.ImCrop, ['edit', 'trim']),

      // IO Icons for design
      createIconData('io-ioiosaperture', IoIcons.IoIosAperture, ['camera', 'photography']),
      createIconData('io-ioiosbrush', IoIcons.IoIosBrush, ['paint', 'create']),
      createIconData('io-ioiosbuild', IoIcons.IoIosBuild, ['construct', 'create']),
      createIconData('io-ioiosbulb', IoIcons.IoIosBulb, ['idea', 'creativity']),
      createIconData('io-ioioscamera', IoIcons.IoIosCamera, ['photography', 'visual']),
      createIconData('io-ioioscolorfill', IoIcons.IoIosColorFill, ['color', 'fill']),
      createIconData('io-ioioscolorfilter', IoIcons.IoIosColorFilter, ['color', 'filter']),
      createIconData('io-ioioscolorpalette', IoIcons.IoIosColorPalette, ['color', 'palette']),
      createIconData('io-ioioscolorwand', IoIcons.IoIosColorWand, ['color', 'magic']),
      createIconData('io-ioiosconstruct', IoIcons.IoIosConstruct, ['build', 'create']),
      createIconData('io-ioioscontrast', IoIcons.IoIosContrast, ['contrast', 'adjust']),
      createIconData('io-ioioscreate', IoIcons.IoIosCreate, ['create', 'new']),
      createIconData('io-ioioscrop', IoIcons.IoIosCrop, ['edit', 'trim']),
      createIconData('io-ioioscube', IoIcons.IoIosCube, ['3d', 'dimension']),
      createIconData('io-ioioscut', IoIcons.IoIosCut, ['cut', 'scissors']),
      createIconData('io-ioioseasel', IoIcons.IoIosEasel, ['art', 'painting']),

      // RI Icons for design
      createIconData('ri-rialignitemverticalcenterfill', RiIcons.RiAlignItemVerticalCenterFill, ['align', 'vertical']),
      createIconData('ri-rialignitemverticalcenterline', RiIcons.RiAlignItemVerticalCenterLine, ['align', 'vertical']),

      // TI Icons for design
      createIconData('ti-tiadjustbrightness', TiIcons.TiAdjustBrightness, ['brightness', 'adjust']),
      createIconData('ti-tiadjustcontrast', TiIcons.TiAdjustContrast, ['contrast', 'adjust']),
      createIconData('ti-tibrush', TiIcons.TiBrush, ['paint', 'create']),
      createIconData('ti-ticamera', TiIcons.TiCamera, ['photography', 'visual']),
      createIconData('ti-ticameraoutline', TiIcons.TiCameraOutline, ['photography', 'visual']),
      createIconData('ti-tifeather', TiIcons.TiFeather, ['light', 'elegant']),

      // VSC Icons for design
      createIconData('vsc-vsccircle', VscIcons.VscCircle, ['shape', 'geometry']),
      createIconData('vsc-vsccirclefilled', VscIcons.VscCircleFilled, ['shape', 'geometry']),
    ]
  },
  {
    industry: 'food',
    icons: [
      // Lucide Icons
      createIconData('coffee', Coffee, ['beverage', 'drink']),
      createIconData('pizza', Pizza, ['food', 'italian']),

      // React Icons
      createIconData('bi-bibaguette', BiIcons.BiBaguette, ['bread', 'french']),
      createIconData('bi-bibowlhot', BiIcons.BiBowlHot, ['soup', 'hot']),
      createIconData('bi-bibowlrice', BiIcons.BiBowlRice, ['rice', 'asian']),
      createIconData('cg-cgbowl', CgIcons.CgBowl, ['container', 'food']),
      createIconData('fa-fabacon', FaIcons.FaBacon, ['meat', 'breakfast']),
      createIconData('fa-fabeer', FaIcons.FaBeer, ['alcohol', 'beverage']),
      createIconData('fa-fabirthdaycake', FaIcons.FaBirthdayCake, ['cake', 'celebration']),
      createIconData('gr-grcafeteria', GrIcons.GrCafeteria, ['restaurant', 'dining']),
      createIconData('hi-hicake', HiIcons.HiCake, ['dessert', 'celebration']),
      createIconData('im-imdelicious', ImIcons.ImDelicious, ['tasty', 'food']),
      createIconData('io-ioiosbeer', IoIcons.IoIosBeer, ['alcohol', 'beverage']),
      createIconData('io-ioioscafe', IoIcons.IoIosCafe, ['coffee', 'restaurant']),
      createIconData('io-ioiosegg', IoIcons.IoIosEgg, ['protein', 'breakfast']),
      createIconData('ti-tibeer', TiIcons.TiBeer, ['alcohol', 'beverage']),
      createIconData('ti-ticoffee', TiIcons.TiCoffee, ['beverage', 'caffeine']),
    ]
  },
  {
    industry: 'education',
    icons: [
      // Lucide Icons
      createIconData('search', Search, ['research', 'explore']),
      createIconData('lightbulb', Lightbulb, ['idea', 'learning']),
      createIconData('help-circle', HelpCircle, ['question', 'support']),
      createIconData('bookmark', Bookmark, ['save', 'reference']),
      createIconData('archive', Archive, ['storage', 'library']),
      createIconData('school', School, ['education', 'institution']),

      // React Icons
      createIconData('bi-biabacus', BiIcons.BiAbacus, ['calculation', 'math']),
      createIconData('bi-bianalyse', BiIcons.BiAnalyse, ['research', 'study']),
      createIconData('bi-bibible', BiIcons.BiBible, ['book', 'religion']),
      createIconData('bi-bibookopen', BiIcons.BiBookOpen, ['reading', 'knowledge']),
      createIconData('bi-bibookreader', BiIcons.BiBookReader, ['reading', 'study']),
      createIconData('bi-bibookmark', BiIcons.BiBookmark, ['save', 'reference']),
      createIconData('bi-bibookmarkalt', BiIcons.BiBookmarkAlt, ['save', 'reference']),
      createIconData('bi-bibookmarkminus', BiIcons.BiBookmarkMinus, ['remove', 'bookmark']),
      createIconData('bi-bibookmarkplus', BiIcons.BiBookmarkPlus, ['add', 'bookmark']),
      createIconData('bi-bibookmarks', BiIcons.BiBookmarks, ['collection', 'references']),
      createIconData('bi-bibrain', BiIcons.BiBrain, ['intelligence', 'learning']),
      createIconData('bi-bibulb', BiIcons.BiBulb, ['idea', 'innovation']),
      createIconData('cg-cgassign', CgIcons.CgAssign, ['assignment', 'task']),
      createIconData('fa-fabible', FaIcons.FaBible, ['book', 'religion']),
      createIconData('fi-fibook', FiIcons.FiBook, ['reading', 'knowledge']),
      createIconData('fi-fibookmark', FiIcons.FiBookmark, ['save', 'reference']),
      createIconData('go-gobeaker', GoIcons.GoBeaker, ['science', 'experiment']),
      createIconData('gr-grad', GrIcons.GrAd, ['advertisement', 'promotion']),
      createIconData('gr-graed', GrIcons.GrAed, ['medical', 'emergency']),
      createIconData('gr-grarticle', GrIcons.GrArticle, ['content', 'text']),
      createIconData('gr-grblockquote', GrIcons.GrBlockQuote, ['quote', 'citation']),
      createIconData('gr-grcertificate', GrIcons.GrCertificate, ['achievement', 'qualification']),
      createIconData('hi-hiacademiccap', HiIcons.HiAcademicCap, ['graduation', 'achievement']),
      createIconData('hi-hibeaker', HiIcons.HiBeaker, ['science', 'experiment']),
      createIconData('hi-hibookopen', HiIcons.HiBookOpen, ['reading', 'knowledge']),
      createIconData('hi-hibookmark', HiIcons.HiBookmark, ['save', 'reference']),
      createIconData('hi-hibookmarkalt', HiIcons.HiBookmarkAlt, ['save', 'reference']),
      createIconData('hi-hicalculator', HiIcons.HiCalculator, ['math', 'computation']),
      createIconData('hi-hidocumentreport', HiIcons.HiDocumentReport, ['report', 'analysis']),
      createIconData('hi-hidocumentsearch', HiIcons.HiDocumentSearch, ['research', 'find']),
      createIconData('im-imbooks', ImIcons.ImBooks, ['library', 'collection']),
      createIconData('io-ioiosbeaker', IoIcons.IoIosBeaker, ['science', 'experiment']),
      createIconData('io-ioiosbook', IoIcons.IoIosBook, ['reading', 'knowledge']),
      createIconData('io-ioiosbookmark', IoIcons.IoIosBookmark, ['save', 'reference']),
      createIconData('ti-tibook', TiIcons.TiBook, ['reading', 'knowledge']),
      createIconData('ti-tibookmark', TiIcons.TiBookmark, ['save', 'reference']),
    ]
  },
  {
    industry: 'retail',
    icons: [
      // Lucide Icons
      createIconData('shopping-cart', ShoppingCart, ['purchase', 'buy']),
      createIconData('credit-card', CreditCard, ['payment', 'money']),
      createIconData('gift', Gift, ['present', 'reward']),
      createIconData('store', Store, ['shop', 'business']),

      // React Icons
      createIconData('ai-aifillcarryout', AiIcons.AiFillCarryOut, ['takeaway', 'delivery']),
      createIconData('ai-aifillcreditcard', AiIcons.AiFillCreditCard, ['payment', 'money']),
      createIconData('ai-aifillgift', AiIcons.AiFillGift, ['present', 'reward']),
      createIconData('bi-bibasket', BiIcons.BiBasket, ['shopping', 'container']),
      createIconData('fa-faad', FaIcons.FaAd, ['advertisement', 'promotion']),
      createIconData('fa-faadversal', FaIcons.FaAdversal, ['advertising', 'marketing']),
      createIconData('fa-faad', FaIcons.FaAd, ['affiliate', 'marketing']),
      createIconData('fa-fabarcode', FaIcons.FaBarcode, ['scan', 'product']),
      createIconData('fi-figift', FiIcons.FiGift, ['present', 'reward']),
      createIconData('go-gogift', GoIcons.GoGift, ['present', 'reward']),
      createIconData('gr-grbasket', GrIcons.GrBasket, ['shopping', 'container']),
      createIconData('gr-grcart', GrIcons.GrCart, ['shopping', 'purchase']),
      createIconData('hi-higift', HiIcons.HiGift, ['present', 'reward']),
      createIconData('im-imcart', ImIcons.ImCart, ['shopping', 'purchase']),
      createIconData('io-ioiosbasket', IoIcons.IoIosBasket, ['shopping', 'container']),
      createIconData('io-ioioscart', IoIcons.IoIosCart, ['shopping', 'purchase']),
      createIconData('io-ioioscash', IoIcons.IoIosCash, ['money', 'payment']),
    ]
  },
  {
    industry: 'construction',
    icons: [
      // Lucide Icons
      createIconData('home', Home, ['house', 'building']),
      createIconData('wrench', Wrench, ['tools', 'repair']),
      createIconData('hammer', Hammer, ['tools', 'build']),

      // React Icons
      createIconData('bi-biarch', BiIcons.BiArch, ['architecture', 'structure']),
      createIconData('bi-bibuildinghouse', BiIcons.BiBuildingHouse, ['residential', 'property']),
      createIconData('fa-faarchway', FaIcons.FaArchway, ['architecture', 'entrance']),
      createIconData('io-ioiosbuild', IoIcons.IoIosBuild, ['construction', 'tools']),
      createIconData('io-ioiosconstruct', IoIcons.IoIosConstruct, ['build', 'create']),
      createIconData('ri-riancientgatefill', RiIcons.RiAncientGateFill, ['gate', 'entrance']),
      createIconData('ri-riancientgateline', RiIcons.RiAncientGateLine, ['gate', 'entrance']),
      createIconData('ri-riancientgatefill', RiIcons.RiAncientGateFill, ['building', 'structure']),
      createIconData('ri-riancientgateline', RiIcons.RiAncientGateLine, ['building', 'structure']),
    ]
  },
  {
    industry: 'automotive',
    icons: [
      // Lucide Icons
      createIconData('car', Car, ['vehicle', 'transport']),
      createIconData('plane', Plane, ['aircraft', 'travel']),
      createIconData('ship', Ship, ['vessel', 'maritime']),
      createIconData('car', Car, ['bike', 'cycling']),
      createIconData('rocket', Rocket, ['space', 'fast']),
      createIconData('compass', Compass, ['navigation', 'direction']),

      // React Icons
      createIconData('ai-aifillcar', AiIcons.AiFillCar, ['vehicle', 'transport']),
      createIconData('bi-bibus', BiIcons.BiBus, ['public-transport', 'vehicle']),
      createIconData('bi-bibuoy', BiIcons.BiBuoy, ['safety', 'maritime']),
      createIconData('bs-bsairplane', BsIcons.BsAirplane, ['aircraft', 'travel']),
      createIconData('bs-bsairplaneengines', BsIcons.BsAirplaneEngines, ['aircraft', 'engine']),
      createIconData('bs-bsairplaneenginesfill', BsIcons.BsAirplaneEnginesFill, ['aircraft', 'engine']),
      createIconData('bs-bsairplanefill', BsIcons.BsAirplaneFill, ['aircraft', 'travel']),
      createIconData('cg-cgairplane', CgIcons.CgAirplane, ['aircraft', 'travel']),
      createIconData('cg-cgbmw', CgIcons.CgBmw, ['car', 'brand']),
      createIconData('fa-faambulance', FaIcons.FaAmbulance, ['emergency', 'medical']),
      createIconData('fa-facar', FaIcons.FaCar, ['bike', 'cycling']),
      createIconData('gr-grbike', GrIcons.GrBike, ['bicycle', 'cycling']),
      createIconData('gr-grbus', GrIcons.GrBus, ['public-transport', 'vehicle']),
      createIconData('gr-grcar', GrIcons.GrCar, ['vehicle', 'transport']),
      createIconData('io-ioiosairplane', IoIcons.IoIosAirplane, ['aircraft', 'travel']),
      createIconData('io-ioioscar', IoIcons.IoIosCar, ['bike', 'cycling']),
      createIconData('io-ioiosboat', IoIcons.IoIosBoat, ['vessel', 'maritime']),
      createIconData('io-ioiosbus', IoIcons.IoIosBus, ['public-transport', 'vehicle']),
      createIconData('io-ioioscar', IoIcons.IoIosCar, ['vehicle', 'transport']),
      createIconData('md-mdair', MdIcons.MdAir, ['air', 'atmosphere']),
    ]
  },
  {
    industry: 'consulting',
    icons: [
      // Lucide Icons
      createIconData('briefcase', Briefcase, ['business', 'professional']),
      createIconData('handshake', Handshake, ['partnership', 'agreement']),
      createIconData('users', Users, ['team', 'group']),
      createIconData('user', User, ['person', 'individual']),
      createIconData('user-plus', UserPlus, ['add', 'recruit']),
      createIconData('phone', Phone, ['communication', 'contact']),
      createIconData('mail', Mail, ['email', 'message']),
      createIconData('message-circle', MessageCircle, ['chat', 'communication']),
      createIconData('send', Send, ['transmit', 'deliver']),
      createIconData('bell', Bell, ['notification', 'alert']),
      createIconData('help-circle', HelpCircle, ['support', 'assistance']),
      createIconData('award', Award, ['achievement', 'excellence']),

      // React Icons
      createIconData('ai-aifillbell', AiIcons.AiFillBell, ['notification', 'alert']),
      createIconData('ai-aifillcontacts', AiIcons.AiFillContacts, ['people', 'network']),
      createIconData('ai-aifillcustomerservice', AiIcons.AiFillCustomerService, ['support', 'help']),
      createIconData('ai-aifillidcard', AiIcons.AiFillIdcard, ['identity', 'credential']),
      createIconData('bi-biaward', BiIcons.BiAward, ['achievement', 'recognition']),
      createIconData('bi-bibriefcase', BiIcons.BiBriefcase, ['business', 'professional']),
      createIconData('bi-bibriefcasealt', BiIcons.BiBriefcaseAlt, ['business', 'case']),
      createIconData('bi-bibriefcasealt2', BiIcons.BiBriefcaseAlt2, ['business', 'portfolio']),
      createIconData('cg-cgattribution', CgIcons.CgAttribution, ['credit', 'recognition']),
      createIconData('cg-cgawards', CgIcons.CgAwards, ['achievement', 'honors']),
      createIconData('fa-faaddresscard', FaIcons.FaAddressCard, ['contact', 'identity']),
      createIconData('fa-faaward', FaIcons.FaAward, ['achievement', 'prize']),
      createIconData('fi-fiatsign', FiIcons.FiAtSign, ['email', 'contact']),
      createIconData('fi-fiaward', FiIcons.FiAward, ['achievement', 'recognition']),
      createIconData('go-gobell', GoIcons.GoBell, ['notification', 'alert']),
      createIconData('go-gobellfill', GoIcons.GoBellFill, ['notification', 'alert']),
      createIconData('go-gocomment', GoIcons.GoComment, ['discussion', 'feedback']),
      createIconData('go-gocommentdiscussion', GoIcons.GoCommentDiscussion, ['chat', 'dialogue']),
      createIconData('gr-grbusinessservice', GrIcons.GrBusinessService, ['service', 'professional']),
      createIconData('gr-grchat', GrIcons.GrChat, ['communication', 'talk']),
      createIconData('gr-grchatoption', GrIcons.GrChatOption, ['chat', 'options']),
      createIconData('hi-hibadgecheck', HiIcons.HiBadgeCheck, ['verified', 'approved']),
      createIconData('hi-hibriefcase', HiIcons.HiBriefcase, ['business', 'professional']),
      createIconData('hi-hichat', HiIcons.HiChat, ['communication', 'message']),
      createIconData('hi-hichatalt', HiIcons.HiChatAlt, ['chat', 'alternative']),
      createIconData('hi-hichatalt2', HiIcons.HiChatAlt2, ['chat', 'conversation']),
      createIconData('hi-hiidentification', HiIcons.HiIdentification, ['id', 'credential']),
      createIconData('im-imbubble', ImIcons.ImBubble, ['speech', 'chat']),
      createIconData('im-imbubble2', ImIcons.ImBubble2, ['speech', 'chat']),
      createIconData('im-imbubbles', ImIcons.ImBubbles, ['conversation', 'chat']),
      createIconData('im-imbubbles2', ImIcons.ImBubbles2, ['conversation', 'chat']),
      createIconData('im-imbubbles3', ImIcons.ImBubbles3, ['conversation', 'chat']),
      createIconData('im-imbubbles4', ImIcons.ImBubbles4, ['conversation', 'chat']),
      createIconData('im-imbullhorn', ImIcons.ImBullhorn, ['announcement', 'megaphone']),
      createIconData('io-ioiosbriefcase', IoIcons.IoIosBriefcase, ['business', 'professional']),
      createIconData('io-ioiosbusiness', IoIcons.IoIosBusiness, ['company', 'corporate']),
      createIconData('io-ioioscall', IoIcons.IoIosCall, ['phone', 'contact']),
      createIconData('io-ioioschatbubbles', IoIcons.IoIosChatbubbles, ['chat', 'conversation']),
      createIconData('io-ioioscontact', IoIcons.IoIosContact, ['person', 'individual']),
      createIconData('io-ioioscontacts', IoIcons.IoIosContacts, ['people', 'network']),
      createIconData('ri-riaccountboxline', RiIcons.RiAccountBoxLine, ['profile', 'account']),
      createIconData('ri-riaccountcircle2fill', RiIcons.RiAccountCircle2Fill, ['user', 'profile']),
      createIconData('ri-riaccountcircle2line', RiIcons.RiAccountCircle2Line, ['user', 'profile']),
      createIconData('ri-riaccountcirclefill', RiIcons.RiAccountCircleFill, ['user', 'profile']),
      createIconData('ri-riaccountcircleline', RiIcons.RiAccountCircleLine, ['user', 'profile']),
      createIconData('ti-tiat', TiIcons.TiAt, ['email', 'mention']),
      createIconData('ti-tibell', TiIcons.TiBell, ['notification', 'alert']),
      createIconData('ti-tibriefcase', TiIcons.TiBriefcase, ['business', 'professional']),
      createIconData('ti-ticontacts', TiIcons.TiContacts, ['people', 'network']),
      createIconData('vsc-vscaccount', VscIcons.VscAccount, ['user', 'profile']),
      createIconData('vsc-vsccomment', VscIcons.VscComment, ['discussion', 'feedback']),
      createIconData('vsc-vsccommentdiscussion', VscIcons.VscCommentDiscussion, ['chat', 'dialogue']),
    ]
  },
  {
    industry: 'entertainment',
    icons: [
      // Lucide Icons
      createIconData('gamepad-2', Gamepad2, ['gaming', 'controller']),
      createIconData('music', Music, ['audio', 'sound']),
      createIconData('play', Play, ['start', 'begin']),
      createIconData('pause', Pause, ['stop', 'break']),
      createIconData('stop', Stop, ['end', 'finish']),
      createIconData('volume-2', Volume2, ['sound', 'audio']),
      createIconData('camera', Camera, ['photography', 'video']),
      createIconData('headphones', Headphones, ['audio', 'listen']),

      // React Icons
      createIconData('ai-aifillaudio', AiIcons.AiFillAudio, ['sound', 'media']),
      createIconData('ai-aifillbackward', AiIcons.AiFillBackward, ['rewind', 'previous']),
      createIconData('ai-aifillcamera', AiIcons.AiFillCamera, ['photography', 'video']),
      createIconData('ai-aifillfastbackward', AiIcons.AiFillFastBackward, ['rewind', 'fast']),
      createIconData('ai-aifillfastforward', AiIcons.AiFillFastForward, ['forward', 'fast']),
      createIconData('ai-aifillforward', AiIcons.AiFillForward, ['next', 'advance']),
      createIconData('bi-bialbum', BiIcons.BiAlbum, ['music', 'collection']),
      createIconData('fa-faaudible', FaIcons.FaAudible, ['audio', 'listen']),
      createIconData('fi-ficamera', FiIcons.FiCamera, ['photography', 'video']),
      createIconData('fi-ficameraoff', FiIcons.FiCameraOff, ['no-camera', 'disabled']),
      createIconData('fi-fidisc', FiIcons.FiDisc, ['music', 'media']),
      createIconData('fi-fifastforward', FiIcons.FiFastForward, ['forward', 'fast']),
      createIconData('gr-grcamera', GrIcons.GrCamera, ['photography', 'video']),
      createIconData('gr-grcircleplay', GrIcons.GrCirclePlay, ['play', 'start']),
      createIconData('gr-grclosedcaption', GrIcons.GrClosedCaption, ['subtitles', 'accessibility']),
      createIconData('hi-hicamera', HiIcons.HiCamera, ['photography', 'video']),
      createIconData('im-imbackward', ImIcons.ImBackward, ['rewind', 'previous']),
      createIconData('im-imbackward2', ImIcons.ImBackward2, ['rewind', 'previous']),
      createIconData('im-imcamera', ImIcons.ImCamera, ['photography', 'video']),
      createIconData('im-imclubs', ImIcons.ImClubs, ['cards', 'games']),
      createIconData('im-imdice', ImIcons.ImDice, ['games', 'random']),
      createIconData('io-ioiosalbums', IoIcons.IoIosAlbums, ['music', 'collection']),
      createIconData('io-ioioscamera', IoIcons.IoIosCamera, ['photography', 'video']),
      createIconData('io-ioiosdisc', IoIcons.IoIosDisc, ['music', 'media']),
      createIconData('ri-rialbumfill', RiIcons.RiAlbumFill, ['music', 'collection']),
      createIconData('ri-rialbumline', RiIcons.RiAlbumLine, ['music', 'collection']),
      createIconData('ri-rialiensfill', RiIcons.RiAliensFill, ['alien', 'space']),
      createIconData('ri-rialiensline', RiIcons.RiAliensLine, ['alien', 'space']),
      createIconData('ti-ticamera', TiIcons.TiCamera, ['photography', 'video']),
      createIconData('ti-ticameraoutline', TiIcons.TiCameraOutline, ['photography', 'video']),
      createIconData('ti-tifilm', TiIcons.TiFilm, ['movie', 'cinema']),
    ]
  },
  {
    industry: 'legal',
    icons: [
      // Lucide Icons
      createIconData('handshake', Handshake, ['agreement', 'contract']),
      createIconData('briefcase', Briefcase, ['business', 'professional']),
      createIconData('shield', Shield, ['protection', 'security']),
      createIconData('lock', Lock, ['security', 'protection']),
      createIconData('unlock', Unlock, ['access', 'freedom']),
      createIconData('key', Key, ['access', 'authority']),

      // React Icons
      createIconData('ai-aifillcopyrightcircle', AiIcons.AiFillCopyrightCircle, ['copyright', 'legal']),
      createIconData('ai-aifillidcard', AiIcons.AiFillIdcard, ['identity', 'legal']),
      createIconData('fa-fabalancescale', FaIcons.FaBalanceScale, ['justice', 'law']),
      createIconData('fa-fabalancescalele', FaIcons.FaBalanceScaleLeft, ['justice', 'law']),
      createIconData('fa-fabalancescaleright', FaIcons.FaBalanceScaleRight, ['justice', 'law']),
      createIconData('hi-hiidentification', HiIcons.HiIdentification, ['identity', 'security']),
      createIconData('hi-hiidentification', HiIcons.HiIdentification, ['identity', 'legal']),
    ]
  },
  {
    industry: 'travel',
    icons: [
      // Lucide Icons
      createIconData('globe', Globe, ['world', 'international']),
      createIconData('car', Car, ['vehicle', 'transport']),
      createIconData('plane', Plane, ['flight', 'aviation']),
      createIconData('ship', Ship, ['cruise', 'maritime']),
      createIconData('car', Car, ['cycling', 'eco']),
      createIconData('rocket', Rocket, ['space', 'adventure']),
      createIconData('compass', Compass, ['navigation', 'direction']),
      createIconData('home', Home, ['accommodation', 'stay']),

      // React Icons
      createIconData('ai-aifillcar', AiIcons.AiFillCar, ['vehicle', 'transport']),
      createIconData('ai-aifillcompass', AiIcons.AiFillCompass, ['navigation', 'direction']),
      createIconData('ai-aifillhome', AiIcons.AiFillHome, ['accommodation', 'stay']),
      createIconData('bi-bianchor', BiIcons.BiAnchor, ['maritime', 'harbor']),
      createIconData('bi-bibed', BiIcons.BiBed, ['accommodation', 'hotel']),
      createIconData('bi-bibus', BiIcons.BiBus, ['transport', 'public']),
      createIconData('bs-bsairplane', BsIcons.BsAirplane, ['flight', 'aviation']),
      createIconData('bs-bsairplaneengines', BsIcons.BsAirplaneEngines, ['flight', 'aviation']),
      createIconData('bs-bsairplaneenginesfill', BsIcons.BsAirplaneEnginesFill, ['flight', 'aviation']),
      createIconData('bs-bsairplanefill', BsIcons.BsAirplaneFill, ['flight', 'aviation']),
      createIconData('cg-cgairplane', CgIcons.CgAirplane, ['flight', 'aviation']),
      createIconData('cg-cganchor', CgIcons.CgAnchor, ['maritime', 'harbor']),
      createIconData('fa-faairbnb', FaIcons.FaAirbnb, ['accommodation', 'rental']),
      createIconData('fa-faanchor', FaIcons.FaAnchor, ['maritime', 'harbor']),
      createIconData('fa-fabed', FaIcons.FaBed, ['accommodation', 'hotel']),
      createIconData('fi-fianchor', FiIcons.FiAnchor, ['maritime', 'harbor']),
      createIconData('fi-ficompass', FiIcons.FiCompass, ['navigation', 'direction']),
      createIconData('go-goglobe', GoIcons.GoGlobe, ['world', 'international']),
      createIconData('go-gohome', GoIcons.GoHome, ['accommodation', 'stay']),
      createIconData('go-gohomefill', GoIcons.GoHomeFill, ['accommodation', 'stay']),
      createIconData('gr-granchor', GrIcons.GrAnchor, ['maritime', 'harbor']),
      createIconData('gr-grbeacon', GrIcons.GrBeacon, ['lighthouse', 'guide']),
      createIconData('gr-grbus', GrIcons.GrBus, ['transport', 'public']),
      createIconData('gr-grcar', GrIcons.GrCar, ['vehicle', 'transport']),
      createIconData('hi-higlobe', HiIcons.HiGlobe, ['world', 'international']),
      createIconData('im-imcompass', ImIcons.ImCompass, ['navigation', 'direction']),
      createIconData('im-imcompass2', ImIcons.ImCompass2, ['navigation', 'direction']),
      createIconData('io-ioiosbed', IoIcons.IoIosBed, ['accommodation', 'hotel']),
      createIconData('io-ioiosboat', IoIcons.IoIosBoat, ['maritime', 'cruise']),
      createIconData('io-ioiosbus', IoIcons.IoIosBus, ['transport', 'public']),
      createIconData('io-ioioscar', IoIcons.IoIosCar, ['vehicle', 'transport']),
      createIconData('io-ioioscompass', IoIcons.IoIosCompass, ['navigation', 'direction']),
      createIconData('ri-rianchorfill', RiIcons.RiAnchorFill, ['maritime', 'harbor']),
      createIconData('ri-rianchorline', RiIcons.RiAnchorLine, ['maritime', 'harbor']),
      createIconData('ti-tianchor', TiIcons.TiAnchor, ['maritime', 'harbor']),
      createIconData('ti-tianchoroutline', TiIcons.TiAnchorOutline, ['maritime', 'harbor']),
      createIconData('ti-ticompass', TiIcons.TiCompass, ['navigation', 'direction']),
      createIconData('ti-tidirections', TiIcons.TiDirections, ['navigation', 'route']),
      createIconData('vsc-vsccompass', VscIcons.VscCompass, ['navigation', 'direction']),
      createIconData('vsc-vsccompassactive', VscIcons.VscCompassActive, ['navigation', 'active']),
      createIconData('vsc-vsccompassdot', VscIcons.VscCompassDot, ['navigation', 'location']),
    ]
  },
  {
    industry: 'beauty',
    icons: [
      // Lucide Icons
      createIconData('heart', Heart, ['love', 'care']),
      createIconData('star', Star, ['rating', 'quality']),
      createIconData('crown', Crown, ['luxury', 'premium']),
      createIconData('scissors', Scissors, ['hair', 'styling']),

      // React Icons
      createIconData('fa-faairfreshener', FaIcons.FaAirFreshener, ['fragrance', 'scent']),
      createIconData('fa-fabath', FaIcons.FaBath, ['bathing', 'spa']),
      createIconData('gr-grcoatcheck', GrIcons.GrCoatCheck, ['fashion', 'clothing']),
      createIconData('io-ioiosbowtie', IoIcons.IoIosBowtie, ['fashion', 'formal']),
      createIconData('io-ioiosbrush', IoIcons.IoIosBrush, ['makeup', 'beauty']),
      createIconData('ri-riarmchairfill', RiIcons.RiArmchairFill, ['furniture', 'salon']),
      createIconData('ri-riarmchairline', RiIcons.RiArmchairLine, ['furniture', 'salon']),
    ]
  },
  {
    industry: 'nonprofit',
    icons: [
      // Lucide Icons
      createIconData('heart', Heart, ['love', 'care']),
      createIconData('sun', Sun, ['hope', 'energy']),
      createIconData('cloud', Cloud, ['nature', 'environment']),
      createIconData('flame', Flame, ['passion', 'spirit']),
      createIconData('droplets', Droplets, ['water', 'life']),
      createIconData('leaf', Leaf, ['environment', 'green']),
      createIconData('leaf', Leaf, ['nature', 'growth']),
      createIconData('flower', Flower, ['beauty', 'nature']),
      createIconData('mountain', Mountain, ['nature', 'adventure']),
      createIconData('handshake', Handshake, ['partnership', 'cooperation']),
      createIconData('globe', Globe, ['global', 'worldwide']),
      createIconData('users', Users, ['community', 'people']),
      createIconData('user', User, ['individual', 'person']),
      createIconData('user-plus', UserPlus, ['inclusion', 'welcome']),
      createIconData('gift', Gift, ['donation', 'giving']),

      // React Icons
      createIconData('ai-aifillenvironment', AiIcons.AiFillEnvironment, ['environment', 'ecology']),
      createIconData('ai-aifillgift', AiIcons.AiFillGift, ['donation', 'giving']),
      createIconData('ai-aifillheart', AiIcons.AiFillHeart, ['love', 'care']),
      createIconData('bi-biaccessibility', BiIcons.BiAccessibility, ['accessibility', 'inclusion']),
      createIconData('fa-faaccessibleicon', FaIcons.FaAccessibleIcon, ['accessibility', 'inclusion']),
      createIconData('fa-faamericansignlanguageinterpreting', FaIcons.FaAmericanSignLanguageInterpreting, ['accessibility', 'communication']),
      createIconData('fa-fababy', FaIcons.FaBaby, ['children', 'youth']),
      createIconData('fa-fababycarriage', FaIcons.FaBabyCarriage, ['children', 'family']),
      createIconData('fi-figift', FiIcons.FiGift, ['donation', 'giving']),
      createIconData('go-gogift', GoIcons.GoGift, ['donation', 'giving']),
      createIconData('go-goglobe', GoIcons.GoGlobe, ['global', 'worldwide']),
      createIconData('gr-grbaby', GrIcons.GrBaby, ['children', 'youth']),
      createIconData('hi-higift', HiIcons.HiGift, ['donation', 'giving']),
      createIconData('hi-higlobe', HiIcons.HiGlobe, ['global', 'worldwide']),
      createIconData('im-imaccessibility', ImIcons.ImAccessibility, ['accessibility', 'inclusion']),
      createIconData('md-mdaccessible', MdIcons.MdAccessible, ['accessibility', 'inclusion']),
      createIconData('md-mdaccessibleforward', MdIcons.MdAccessibleForward, ['accessibility', 'progress']),
    ]
  }
];

// Helper function to get icons by industry
export const getIconsByIndustry = (industryKey: string): IconData[] => {
  const industryIcons = industrySpecificIcons.find(item => item.industry === industryKey);
  return industryIcons?.icons || [];
};

// Helper function to get all industries with their icon counts
export const getIndustryIconCounts = (): { [key: string]: number } => {
  const counts: { [key: string]: number } = {};
  industrySpecificIcons.forEach(item => {
    counts[item.industry] = item.icons.length;
  });
  return counts;
};