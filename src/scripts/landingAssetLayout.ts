type Slot = {
	left: number;
	top: number;
};

const desktopSlots: Slot[] = [
	{ left: 0.43, top: 0.14 },
	{ left: 0.68, top: 0.1 },
	{ left: 0.12, top: 0.56 },
	{ left: 0.52, top: 0.3 },
	{ left: 0.74, top: 0.54 },
	{ left: 0.21, top: 0.62 },
	{ left: 0.33, top: 0.78 }
];

const mobileSlots: Slot[] = [
	{ left: 0.18, top: 0.08 },
	{ left: 0.62, top: 0.1 },
	{ left: 0.1, top: 0.76 },
	{ left: 0.2, top: 0.06 },
	{ left: 0.66, top: 0.78 },
	{ left: 0.34, top: 0.68 },
	{ left: 0.72, top: 0.7 }
];

const shuffle = <T,>(items: T[]) => {
	const copy = [...items];
	for (let index = copy.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
	}
	return copy;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const initLandingAssetLayout = () => {
	const container = document.querySelector<HTMLElement>('[data-landing-root]');
	if (!container) return;

	const mediaMobile = window.matchMedia('(max-width: 900px)');
	const assets = Array.from(container.querySelectorAll<HTMLElement>('.landing-asset'));
	if (assets.length === 0) return;
	let activeAsset: HTMLElement | null = null;
	let dragOffsetX = 0;
	let dragOffsetY = 0;

	const applyLayout = () => {
		const rect = container.getBoundingClientRect();
		const width = rect.width;
		const viewportHeight = window.innerHeight;
		const height = Math.min(rect.height, viewportHeight);
		const isMobile = mediaMobile.matches;
		const slots = shuffle(isMobile ? mobileSlots : desktopSlots);
		let slotIndex = 0;

		for (const asset of assets) {
			const isHiddenOnMobile = asset.dataset.hideOnMobile === 'true';
			if (isMobile && isHiddenOnMobile) {
				asset.style.display = 'none';
				continue;
			}

			asset.style.display = '';
			const slot = slots[slotIndex % slots.length];
			slotIndex += 1;

			const assetWidth = Number(
				isMobile ? asset.dataset.width : asset.dataset.widthDesktop ?? asset.dataset.width
			);
			const assetHeight = Number(
				isMobile ? asset.dataset.height : asset.dataset.heightDesktop ?? asset.dataset.height
			);
			const maxLeft = Math.max(0, width - assetWidth);
			const maxTop = Math.max(0, height - assetHeight);
			const left = clamp(slot.left * width, 0, maxLeft);
			const top = clamp(slot.top * height, 0, maxTop);

			asset.style.left = `${left.toFixed(1)}px`;
			asset.style.top = `${top.toFixed(1)}px`;
		}
	};

	const moveAsset = (asset: HTMLElement, clientX: number, clientY: number) => {
		const containerRect = container.getBoundingClientRect();
		const assetWidth = asset.offsetWidth;
		const assetHeight = asset.offsetHeight;
		const maxLeft = Math.max(0, containerRect.width - assetWidth);
		const maxTop = Math.max(0, containerRect.height - assetHeight);
		const nextLeft = clamp(clientX - containerRect.left - dragOffsetX, 0, maxLeft);
		const nextTop = clamp(clientY - containerRect.top - dragOffsetY, 0, maxTop);

		asset.style.left = `${nextLeft.toFixed(1)}px`;
		asset.style.top = `${nextTop.toFixed(1)}px`;
	};

	const handlePointerDown = (event: PointerEvent) => {
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;

		activeAsset = target;
		const rect = target.getBoundingClientRect();
		dragOffsetX = event.clientX - rect.left;
		dragOffsetY = event.clientY - rect.top;
		target.classList.add('is-dragging');
		target.setPointerCapture(event.pointerId);
		moveAsset(target, event.clientX, event.clientY);
		event.preventDefault();
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!activeAsset) return;
		moveAsset(activeAsset, event.clientX, event.clientY);
		event.preventDefault();
	};

	const releaseDrag = (event?: PointerEvent) => {
		if (!activeAsset) return;
		if (event) {
			try {
				activeAsset.releasePointerCapture(event.pointerId);
			} catch {}
		}
		activeAsset.classList.remove('is-dragging');
		activeAsset = null;
	};

	for (const asset of assets) {
		asset.addEventListener('pointerdown', handlePointerDown);
	}

	window.addEventListener('resize', applyLayout, { passive: true });
	mediaMobile.addEventListener('change', applyLayout);
	window.addEventListener('pointermove', handlePointerMove, { passive: false });
	window.addEventListener('pointerup', releaseDrag);
	window.addEventListener('pointercancel', releaseDrag);
	applyLayout();
};
