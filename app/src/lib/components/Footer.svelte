<footer class="signoff">
	<div class="signoff-text">
		<p class="eyebrow">Built by a dev, for devs cramming the night before</p>
		<p class="line">
			Made this at 2 AM before my own interview — figured future-me, and maybe you, could use it
			again. <strong>From one dev to another: thank me later.</strong>
		</p>
		<p class="byline">
			<span class="name">Nakul Nagariya</span>
			<span class="dot">·</span>
			<span class="title">Full-Stack Developer, 11 years in the trenches</span>
		</p>
	</div>
	<div class="actions">
		<a
			class="linkedin-btn"
			href="https://www.linkedin.com/in/nakul-nagariya-1422087b/"
			target="_blank"
			rel="noopener noreferrer"
		>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
				<path
					d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"
				/>
			</svg>
			Say hi on LinkedIn
		</a>
		<a
			class="bmc-btn"
			href="https://www.buymeacoffee.com/nakulnagariya"
			target="_blank"
			rel="noopener noreferrer"
		>
			<img
				src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
				alt="Buy me a coffee"
				width="180"
				height="50"
				loading="lazy"
			/>
		</a>
	</div>
</footer>

<style>
	.signoff {
		background: linear-gradient(140deg, #1a2437, #202f46 68%, #18465a);
		color: #fff;
		border-radius: 16px;
		padding: 1.3rem 1.5rem;
		margin-top: 0.4rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		box-sizing: border-box;
	}

	.signoff-text {
		min-width: 0;
	}

	.eyebrow {
		margin: 0 0 0.4rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #f2a65a;
	}

	.line {
		margin: 0 0 0.6rem;
		font-size: 0.95rem;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.88);
		max-width: 56ch;
	}

	.line strong {
		color: #fff;
	}

	.byline {
		margin: 0;
		font-size: 0.86rem;
		color: rgba(255, 255, 255, 0.65);
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.name {
		font-weight: 700;
		color: #fff;
	}

	.dot {
		opacity: 0.5;
	}

	.actions {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		flex-wrap: wrap;
	}

	.linkedin-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: #ef791b;
		color: #1a2437;
		font-weight: 700;
		font-size: 0.88rem;
		text-decoration: none;
		padding: 0.65rem 1.1rem;
		border-radius: 10px;
		white-space: nowrap;
		transition:
			background 0.15s,
			transform 0.15s;
	}

	.linkedin-btn:hover {
		background: #ffa94d;
		transform: translateY(-2px);
	}

	.bmc-btn {
		display: inline-flex;
		line-height: 0;
		border-radius: 10px;
		overflow: hidden;
		transition: transform 0.15s;
	}

	.bmc-btn img {
		display: block;
		width: 180px;
		height: 50px;
	}

	.bmc-btn:hover {
		transform: translateY(-2px);
	}

	/* ── Tablet + smaller (≤ 1024px) ── */
	@media (max-width: 1024px) {
		.signoff {
			flex-direction: column;
			align-items: flex-start;
		}

		.actions {
			width: 100%;
		}

		.linkedin-btn {
			flex: 1;
			justify-content: center;
		}

		.bmc-btn {
			flex: 1;
		}

		.bmc-btn img {
			width: 100%;
			height: auto;
		}
	}

	/* ── Phablets & phones (≤ 768px) ── */
	@media (max-width: 768px) {
		.signoff {
			padding: 1.1rem 1.2rem;
			border-radius: 14px;
		}

		.line {
			font-size: 0.9rem;
			max-width: none;
		}
	}

	/* ── Small phones (≤ 480px) ── */
	@media (max-width: 480px) {
		.signoff {
			padding: 1rem;
		}

		.eyebrow {
			font-size: 0.68rem;
		}

		.byline {
			font-size: 0.82rem;
		}

		.linkedin-btn {
			padding: 0.6rem 1rem;
			font-size: 0.85rem;
		}
	}
</style>
