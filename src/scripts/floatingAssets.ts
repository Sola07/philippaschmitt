export const initFloatingAssets = () => {
	const mediaDesktop = window.matchMedia('(min-width: 901px)');
	const mediaReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const assets = Array.from(document.querySelectorAll<HTMLElement>('.floating-asset'));

	if (assets.length === 0) return;

	let pointerX = window.innerWidth * 0.5;
	let pointerY = window.innerHeight * 0.35;
	let pointerActive = false;
	let rafId = 0;
	let enabled = false;
	let viewportWidth = window.innerWidth;
	let viewportHeight = window.innerHeight;

	const state = assets.map((asset) => {
		const inner = asset.querySelector<HTMLElement>('.floating-asset__inner');

		return {
			asset,
			inner,
			currentX: 0,
			currentY: 0,
			targetX: 0,
			targetY: 0,
			currentRotate: 0,
			targetRotate: 0,
			strength: Number(asset.dataset.repelStrength ?? 20),
			radius: Number(asset.dataset.repelRadius ?? 220)
		};
	});

	const resetAsset = (item: (typeof state)[number]) => {
		item.currentX = 0;
		item.currentY = 0;
		item.targetX = 0;
		item.targetY = 0;
		item.currentRotate = 0;
		item.targetRotate = 0;

		if (!item.inner) return;

		item.inner.style.setProperty('--pointer-x', '0px');
		item.inner.style.setProperty('--pointer-y', '0px');
		item.inner.style.setProperty('--pointer-rotate', '0deg');
	};

	const applyMotion = () => {
		for (const item of state) {
			const rect = item.asset.getBoundingClientRect();
			const centerX = rect.left + rect.width * 0.5;
			const centerY = rect.top + rect.height * 0.5;
			const dx = centerX - pointerX;
			const dy = centerY - pointerY;
			const distance = Math.hypot(dx, dy) || 0.0001;
			const withinRange = pointerActive && distance < item.radius;

			if (withinRange) {
				const influence = 1 - distance / item.radius;
				const eased = influence * influence;
				const push = item.strength * eased;
				const unclampedX = (dx / distance) * push;
				const unclampedY = (dy / distance) * push;
				const minX = -rect.left;
				const maxX = viewportWidth - rect.right;
				const minY = -rect.top;
				const maxY = viewportHeight - rect.bottom;
				item.targetX = Math.max(minX, Math.min(maxX, unclampedX));
				item.targetY = Math.max(minY, Math.min(maxY, unclampedY));
				item.targetRotate = ((dx / distance) * 3 + (dy / distance) * 1.5) * eased;
			} else {
				item.targetX = 0;
				item.targetY = 0;
				item.targetRotate = 0;
			}

			item.currentX += (item.targetX - item.currentX) * 0.11;
			item.currentY += (item.targetY - item.currentY) * 0.11;
			item.currentRotate += (item.targetRotate - item.currentRotate) * 0.09;

			if (!item.inner) continue;

			item.inner.style.setProperty('--pointer-x', `${item.currentX.toFixed(2)}px`);
			item.inner.style.setProperty('--pointer-y', `${item.currentY.toFixed(2)}px`);
			item.inner.style.setProperty('--pointer-rotate', `${item.currentRotate.toFixed(2)}deg`);
		}

		if (enabled) {
			rafId = window.requestAnimationFrame(applyMotion);
		} else {
			rafId = 0;
		}
	};

	const startLoop = () => {
		if (!enabled || rafId) return;
		rafId = window.requestAnimationFrame(applyMotion);
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!enabled || !mediaDesktop.matches) return;
		pointerX = event.clientX;
		pointerY = event.clientY;
		pointerActive = true;
		startLoop();
	};

	const handlePointerLeave = () => {
		pointerActive = false;
		startLoop();
	};

	const handleResize = () => {
		viewportWidth = window.innerWidth;
		viewportHeight = window.innerHeight;
	};

	const syncMode = () => {
		const shouldEnable = !mediaReducedMotion.matches;

		if (shouldEnable === enabled) return;
		enabled = shouldEnable;

		if (!enabled) {
			if (rafId) {
				window.cancelAnimationFrame(rafId);
				rafId = 0;
			}
			pointerActive = false;
			for (const item of state) resetAsset(item);
			return;
		}

		startLoop();
	};

	window.addEventListener('pointermove', handlePointerMove, { passive: true });
	window.addEventListener('pointerleave', handlePointerLeave);
	window.addEventListener('blur', handlePointerLeave);
	window.addEventListener('resize', handleResize, { passive: true });
	mediaDesktop.addEventListener('change', syncMode);
	mediaReducedMotion.addEventListener('change', syncMode);
	syncMode();
};
