import asset1 from '../assets/asset_1.svg';
import asset2 from '../assets/asset_2.svg';
import asset3 from '../assets/asset_3.svg';
import asset4 from '../assets/asset_4.svg';
import asset5 from '../assets/asset_5.svg';
import asset6 from '../assets/asset_6.svg';
import asset7 from '../assets/asset_7.svg';

type Dimensions = {
	height: number;
	width: number;
};

export type NavLink = {
	href: string;
	label: string;
};

export type LandingAsset = {
	alt: string;
	className: string;
	depth: number;
	dimensions: Dimensions;
	hideOnMobile?: boolean;
	mobileDimensions?: Dimensions;
	src: string;
};

export const navLinks: NavLink[] = [
	{
		label: 'art',
		href: 'https://drive.google.com/file/d/1mFT8Mb0CSO2xn_bYjUeyz4MmyW-dSqtT/view?usp=drivesdk'
	},
	{
		label: 'graphic design',
		href: 'https://drive.google.com/file/d/1UEGPS8pSccESQzkAgpLnGr4JHxWDnTO5/view'
	},
	{
		label: 'shop',
		href: 'https://philippaschmitt.bigcartel.com/'
	},
	{
		label: 'about / contact',
		href: '/about'
	}
];

export const landingAssets: LandingAsset[] = [
	{
		src: asset1.src,
		alt: 'Noeud rose',
		className: 'asset-1',
		dimensions: { width: 169, height: 180 },
		hideOnMobile: true,
		depth: 3
	},
	{
		src: asset2.src,
		alt: 'Etoile',
		className: 'asset-2',
		dimensions: { width: 136, height: 123 },
		hideOnMobile: true,
		depth: 1
	},
	{
		src: asset3.src,
		alt: 'Coeur',
		className: 'asset-3',
		dimensions: { width: 101, height: 92 },
		mobileDimensions: { width: 86, height: 79 },
		depth: 2
	},
	{
		src: asset4.src,
		alt: 'Perles roses',
		className: 'asset-4',
		dimensions: { width: 280, height: 269 },
		mobileDimensions: { width: 132, height: 127 },
		depth: 2
	},
	{
		src: asset5.src,
		alt: 'Coeur ornamental',
		className: 'asset-5',
		dimensions: { width: 160, height: 111 },
		mobileDimensions: { width: 108, height: 75 },
		depth: 2
	},
	{
		src: asset6.src,
		alt: 'Grand noeud',
		className: 'asset-6',
		dimensions: { width: 313, height: 455 },
		mobileDimensions: { width: 208, height: 302 },
		depth: 1
	},
	{
		src: asset7.src,
		alt: 'Losange rose',
		className: 'asset-7',
		dimensions: { width: 182, height: 195 },
		mobileDimensions: { width: 119, height: 128 },
		depth: 2
	}
];
