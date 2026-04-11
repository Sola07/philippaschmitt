import asset1 from '../assets/asset_1.svg';
import asset2 from '../assets/asset_2.svg';
import asset3 from '../assets/asset_3.svg';
import asset4 from '../assets/asset_4.svg';
import asset5 from '../assets/asset_5.svg';
import asset6 from '../assets/asset_6.svg';
import asset7 from '../assets/asset_7.svg';

type Anchor = {
	bottom?: string;
	left?: string;
	right?: string;
	top?: string;
};

type DriftStep = {
	x: string;
	y: string;
};

type Motion = {
	delay: string;
	duration: string;
	tilt: string;
	steps: [DriftStep, DriftStep, DriftStep, DriftStep];
};

type Interaction = {
	radius: number;
	strength: number;
};

type Dimensions = {
	height: number;
	width: number;
};

type FloatingAssetInput = {
	alt: string;
	className: string;
	depth: number;
	desktop: Anchor;
	dimensions: Dimensions;
	interaction: Interaction;
	mobile: Anchor;
	mobileDriftScale?: number;
	mobileDimensions?: Dimensions;
	motion: Motion;
	src: string;
};

export type NavLink = {
	href: string;
	label: string;
};

export type FloatingAsset = FloatingAssetInput & {
	dataAttributes: {
		radius: string;
		strength: string;
	};
	style: string;
};

const anchorToVars = (prefix: 'desktop' | 'mobile', anchor: Anchor) =>
	Object.entries(anchor)
		.map(([key, value]) => `--${prefix}-${key}: ${value};`)
		.join(' ');

const dimensionsToVars = (dimensions: Dimensions) =>
	`--asset-width: ${dimensions.width}px; --asset-height: ${dimensions.height}px;`;

const mobileDimensionsToVars = (dimensions?: Dimensions) =>
	dimensions
		? `--mobile-asset-width: ${dimensions.width}px; --mobile-asset-height: ${dimensions.height}px;`
		: '';

const mobileDriftScaleToVars = (scale?: number) =>
	typeof scale === 'number' ? `--mobile-drift-scale: ${scale};` : '';

const motionToVars = (motion: Motion) => {
	const [step1, step2, step3, step4] = motion.steps;
	return [
		`--float-duration: ${motion.duration};`,
		`--float-delay: ${motion.delay};`,
		`--float-tilt: ${motion.tilt};`,
		`--drift-x-1: ${step1.x};`,
		`--drift-y-1: ${step1.y};`,
		`--drift-x-2: ${step2.x};`,
		`--drift-y-2: ${step2.y};`,
		`--drift-x-3: ${step3.x};`,
		`--drift-y-3: ${step3.y};`,
		`--drift-x-4: ${step4.x};`,
		`--drift-y-4: ${step4.y};`
	].join(' ');
};

const interactionToVars = (interaction: Interaction, depth: number) =>
	`--asset-depth: ${depth}; --repel-strength: ${interaction.strength}; --repel-radius: ${interaction.radius};`;

const createFloatingAsset = (input: FloatingAssetInput): FloatingAsset => ({
	...input,
	dataAttributes: {
		radius: String(input.interaction.radius),
		strength: String(input.interaction.strength)
	},
	style: [
		dimensionsToVars(input.dimensions),
		mobileDimensionsToVars(input.mobileDimensions),
		mobileDriftScaleToVars(input.mobileDriftScale),
		anchorToVars('desktop', input.desktop),
		anchorToVars('mobile', input.mobile),
		motionToVars(input.motion),
		interactionToVars(input.interaction, input.depth)
	]
		.filter(Boolean)
		.join(' ')
});

export const navLinks: NavLink[] = [
	{
		label: 'art',
		href: 'https://drive.google.com/file/d/1qg2oK0UnOfwMGVXw6mzylcngTM3-DmC0/view?usp=drive_link'
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

export const floatingAssets: FloatingAsset[] = [
	createFloatingAsset({
		src: asset1.src,
		alt: 'Noeud rose',
		className: 'asset-1',
		dimensions: { width: 169, height: 180 },
		mobileDimensions: { width: 0, height: 0 },
		mobileDriftScale: 0,
		depth: 3,
		desktop: { top: '41%', left: '27%' },
		mobile: { top: '68%', left: '34%' },
		interaction: { strength: 22, radius: 220 },
		motion: {
			duration: '22s',
			delay: '-2.2s',
			tilt: '2.8deg',
			steps: [
				{ x: '82px', y: '-52px' },
				{ x: '156px', y: '-132px' },
				{ x: '28px', y: '-188px' },
				{ x: '-46px', y: '-96px' }
			]
		}
	}),
	createFloatingAsset({
		src: asset2.src,
		alt: 'Etoile',
		className: 'asset-2',
		dimensions: { width: 136, height: 123 },
		mobileDimensions: { width: 0, height: 0 },
		mobileDriftScale: 0,
		depth: 1,
		desktop: { top: '58%', left: '10%' },
		mobile: { top: '80%', left: '8%' },
		interaction: { strength: 18, radius: 180 },
		motion: {
			duration: '24s',
			delay: '-4.1s',
			tilt: '2.1deg',
			steps: [
				{ x: '96px', y: '-36px' },
				{ x: '188px', y: '-84px' },
				{ x: '132px', y: '-168px' },
				{ x: '24px', y: '-112px' }
			]
		}
	}),
	createFloatingAsset({
		src: asset3.src,
		alt: 'Coeur',
		className: 'asset-3',
		dimensions: { width: 101, height: 92 },
		mobileDimensions: { width: 86, height: 79 },
		mobileDriftScale: 0.22,
		depth: 2,
		desktop: { bottom: '13%', left: '26%' },
		mobile: { bottom: '11%', left: '10%' },
		interaction: { strength: 15, radius: 160 },
		motion: {
			duration: '20s',
			delay: '-6.5s',
			tilt: '1.9deg',
			steps: [
				{ x: '54px', y: '-30px' },
				{ x: '112px', y: '-78px' },
				{ x: '168px', y: '-24px' },
				{ x: '62px', y: '26px' }
			]
		}
	}),
	createFloatingAsset({
		src: asset4.src,
		alt: 'Perles roses',
		className: 'asset-4',
		dimensions: { width: 280, height: 269 },
		mobileDimensions: { width: 187, height: 177 },
		mobileDriftScale: 0.24,
		depth: 2,
		desktop: { top: '17%', left: '38%' },
		mobile: { top: '10%', left: '18%' },
		interaction: { strength: 18, radius: 220 },
		motion: {
			duration: '26s',
			delay: '-5.8s',
			tilt: '2.4deg',
			steps: [
				{ x: '72px', y: '18px' },
				{ x: '144px', y: '-42px' },
				{ x: '36px', y: '-132px' },
				{ x: '-68px', y: '-58px' }
			]
		}
	}),
	createFloatingAsset({
		src: asset5.src,
		alt: 'Coeur ornamental',
		className: 'asset-5',
		dimensions: { width: 160, height: 111 },
		mobileDimensions: { width: 142, height: 98 },
		mobileDriftScale: 0.22,
		depth: 2,
		desktop: { top: '33%', left: '57%' },
		mobile: { top: '12%', right: '10%' },
		interaction: { strength: 18, radius: 190 },
		motion: {
			duration: '21s',
			delay: '-3.1s',
			tilt: '2deg',
			steps: [
				{ x: '92px', y: '-12px' },
				{ x: '146px', y: '58px' },
				{ x: '24px', y: '112px' },
				{ x: '-74px', y: '46px' }
			]
		}
	}),
	createFloatingAsset({
		src: asset6.src,
		alt: 'Grand noeud',
		className: 'asset-6',
		dimensions: { width: 313, height: 455 },
		mobileDimensions: { width: 208, height: 302 },
		mobileDriftScale: 0.16,
		depth: 1,
		desktop: { top: '10%', right: '11%' },
		mobile: { bottom: '4%', left: '23%' },
		interaction: { strength: 24, radius: 260 },
		motion: {
			duration: '28s',
			delay: '-7.2s',
			tilt: '2.6deg',
			steps: [
				{ x: '-58px', y: '26px' },
				{ x: '-108px', y: '112px' },
				{ x: '-12px', y: '172px' },
				{ x: '54px', y: '84px' }
			]
		}
	}),
	createFloatingAsset({
		src: asset7.src,
		alt: 'Losange rose',
		className: 'asset-7',
		dimensions: { width: 182, height: 195 },
		mobileDimensions: { width: 119, height: 128 },
		mobileDriftScale: 0.18,
		depth: 2,
		desktop: { bottom: '10%', right: '12%' },
		mobile: { bottom: '11%', right: '11%' },
		interaction: { strength: 16, radius: 180 },
		motion: {
			duration: '23s',
			delay: '-8s',
			tilt: '2.2deg',
			steps: [
				{ x: '-34px', y: '-44px' },
				{ x: '-126px', y: '-82px' },
				{ x: '-188px', y: '14px' },
				{ x: '-82px', y: '86px' }
			]
		}
	})
];
