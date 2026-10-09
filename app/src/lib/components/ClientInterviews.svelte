<script lang="ts">
	import { onMount } from 'svelte';

	type QnA = { id: string; question: string; answer: string };
	type ClientInterview = {
		id: string;
		clientName: string;
		role: string;
		date: string;
		qnas: QnA[];
	};

	const STORAGE_KEY = 'bench_client_interviews';

	let interviews = $state<ClientInterview[]>([]);
	let expandedClients = $state<Record<string, boolean>>({});
	let expandedQnAs = $state<Record<string, boolean>>({});

	// Add client form
	let showAddClient = $state(false);
	let newClientName = $state('');
	let newClientRole = $state('');
	let newClientDate = $state('');

	// Add Q&A form
	let addingQnAForClient = $state<string | null>(null);
	let newQuestion = $state('');
	let newAnswer = $state('');

	// Edit Q&A
	let editingQnA = $state<{ clientId: string; qnaId: string } | null>(null);
	let editQuestion = $state('');
	let editAnswer = $state('');

	// Edit client
	let editingClientId = $state<string | null>(null);
	let editClientName = $state('');
	let editClientRole = $state('');

	function persist() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
	}

	function addClient() {
		const name = newClientName.trim();
		if (!name) return;
		const id = crypto.randomUUID();
		interviews = [
			...interviews,
			{
				id,
				clientName: name,
				role: newClientRole.trim(),
				date: newClientDate || new Date().toISOString().split('T')[0],
				qnas: []
			}
		];
		expandedClients = { ...expandedClients, [id]: true };
		newClientName = '';
		newClientRole = '';
		newClientDate = '';
		showAddClient = false;
		persist();
	}

	function deleteClient(id: string) {
		interviews = interviews.filter((i) => i.id !== id);
		persist();
	}

	function startEditClient(interview: ClientInterview) {
		editingClientId = interview.id;
		editClientName = interview.clientName;
		editClientRole = interview.role;
	}

	function saveEditClient() {
		if (!editingClientId || !editClientName.trim()) return;
		interviews = interviews.map((i) =>
			i.id === editingClientId
				? { ...i, clientName: editClientName.trim(), role: editClientRole.trim() }
				: i
		);
		editingClientId = null;
		persist();
	}

	function toggleClient(id: string) {
		expandedClients = { ...expandedClients, [id]: !expandedClients[id] };
	}

	function toggleQnA(id: string) {
		expandedQnAs = { ...expandedQnAs, [id]: !expandedQnAs[id] };
	}

	function openAddQnA(clientId: string) {
		addingQnAForClient = clientId;
		newQuestion = '';
		newAnswer = '';
	}

	function addQnA(clientId: string) {
		if (!newQuestion.trim()) return;
		const qnaId = crypto.randomUUID();
		interviews = interviews.map((i) =>
			i.id === clientId
				? {
						...i,
						qnas: [
							...i.qnas,
							{ id: qnaId, question: newQuestion.trim(), answer: newAnswer.trim() }
						]
					}
				: i
		);
		newQuestion = '';
		newAnswer = '';
		addingQnAForClient = null;
		persist();
	}

	function deleteQnA(clientId: string, qnaId: string) {
		interviews = interviews.map((i) =>
			i.id === clientId ? { ...i, qnas: i.qnas.filter((q) => q.id !== qnaId) } : i
		);
		persist();
	}

	function startEditQnA(clientId: string, qna: QnA) {
		editingQnA = { clientId, qnaId: qna.id };
		editQuestion = qna.question;
		editAnswer = qna.answer;
	}

	function saveEditQnA() {
		if (!editingQnA || !editQuestion.trim()) return;
		const { clientId, qnaId } = editingQnA;
		interviews = interviews.map((i) =>
			i.id === clientId
				? {
						...i,
						qnas: i.qnas.map((q) =>
							q.id === qnaId
								? { ...q, question: editQuestion.trim(), answer: editAnswer.trim() }
								: q
						)
					}
				: i
		);
		editingQnA = null;
		persist();
	}

	function cancelAddQnA() {
		addingQnAForClient = null;
		newQuestion = '';
		newAnswer = '';
	}

	function formatDate(iso: string): string {
		if (!iso) return '';
		const [year, month, day] = iso.split('-');
		const months = [
			'Jan','Feb','Mar','Apr','May','Jun',
			'Jul','Aug','Sep','Oct','Nov','Dec'
		];
		return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
	}

	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				interviews = JSON.parse(saved) as ClientInterview[];
			} catch {
				interviews = [];
			}
		}
	});
</script>

<section class="ci-section">
	<!-- Header -->
	<div class="ci-header">
		<div class="ci-title-group">
			<div class="ci-title-row">
				<h2>Interview Experiences</h2>
				<span class="premium-badge">✦ Premium</span>
			</div>
			<p class="ci-subtitle">Log real interview questions by client and role. Your private knowledge base.</p>
		</div>
		<button class="add-client-btn" onclick={() => (showAddClient = !showAddClient)}>
			{showAddClient ? '✕ Cancel' : '+ Add Client'}
		</button>
	</div>

	<!-- Add Client Form -->
	{#if showAddClient}
		<div class="add-client-form">
			<div class="form-grid">
				<div class="field">
					<label for="ci-client-name">Company / Client *</label>
					<input
						id="ci-client-name"
						type="text"
						placeholder="e.g. Google, Stripe, Netflix"
						bind:value={newClientName}
						onkeydown={(e) => e.key === 'Enter' && addClient()}
					/>
				</div>
				<div class="field">
					<label for="ci-role">Role / Position</label>
					<input
						id="ci-role"
						type="text"
						placeholder="e.g. Senior Frontend Engineer"
						bind:value={newClientRole}
					/>
				</div>
				<div class="field field-date">
					<label for="ci-date">Interview Date</label>
					<input id="ci-date" type="date" bind:value={newClientDate} />
				</div>
			</div>
			<div class="form-actions">
				<button class="btn-primary" onclick={addClient} disabled={!newClientName.trim()}>
					Save Client
				</button>
				<button class="btn-ghost" onclick={() => (showAddClient = false)}>Cancel</button>
			</div>
		</div>
	{/if}

	<!-- Empty State -->
	{#if interviews.length === 0 && !showAddClient}
		<div class="empty-state">
			<div class="empty-icon">💼</div>
			<h3>No interview experiences yet</h3>
			<p>Add a client to start logging interview questions and answers. All data is stored locally in your browser.</p>
			<button class="add-client-btn" onclick={() => (showAddClient = true)}>+ Add Your First Client</button>
		</div>
	{/if}

	<!-- Client Cards -->
	{#if interviews.length > 0}
		<div class="clients-grid">
			{#each interviews as interview (interview.id)}
				<div class="client-card" class:expanded={expandedClients[interview.id]}>
					<!-- Card Header -->
					<div class="card-header">
						<button
							class="card-toggle"
							onclick={() => toggleClient(interview.id)}
							aria-expanded={expandedClients[interview.id]}
						>
							<div class="client-meta">
								<div class="client-avatar">{interview.clientName.charAt(0).toUpperCase()}</div>
								<div class="client-info">
									{#if editingClientId === interview.id}
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<div class="edit-client-inline" role="group" onkeydown={(e) => e.stopPropagation()} onclick={(e) => e.stopPropagation()}>
											<input
												class="edit-input"
												type="text"
												bind:value={editClientName}
												placeholder="Company name"
												onkeydown={(e) => e.key === 'Enter' && saveEditClient()}
											/>
											<input
												class="edit-input edit-input-sm"
												type="text"
												bind:value={editClientRole}
												placeholder="Role"
												onkeydown={(e) => e.key === 'Enter' && saveEditClient()}
											/>
										</div>
									{:else}
										<span class="client-name">{interview.clientName}</span>
										{#if interview.role}
											<span class="client-role">{interview.role}</span>
										{/if}
									{/if}
								</div>
							</div>
							<div class="card-header-right">
								{#if interview.date}
									<span class="card-date">{formatDate(interview.date)}</span>
								{/if}
								<span class="qna-count">{interview.qnas.length} Q&A{interview.qnas.length !== 1 ? 's' : ''}</span>
								<span class="chevron" class:open={expandedClients[interview.id]}>▾</span>
							</div>
						</button>
						<div class="card-actions">
							{#if editingClientId === interview.id}
								<button class="action-btn save" onclick={saveEditClient} title="Save">✓</button>
								<button class="action-btn" onclick={() => (editingClientId = null)} title="Cancel">✕</button>
							{:else}
								<button class="action-btn edit" onclick={() => startEditClient(interview)} title="Edit client">✎</button>
								<button class="action-btn delete" onclick={() => deleteClient(interview.id)} title="Delete client">✕</button>
							{/if}
						</div>
					</div>

					<!-- Q&A List -->
					{#if expandedClients[interview.id]}
						<div class="qna-section">
							{#if interview.qnas.length === 0 && addingQnAForClient !== interview.id}
								<p class="no-qna">No questions logged yet. Add your first question below.</p>
							{/if}

							{#each interview.qnas as qna, idx (qna.id)}
								<div class="qna-item">
									<button
										class="qna-question-btn"
										onclick={() => toggleQnA(qna.id)}
										aria-expanded={expandedQnAs[qna.id]}
									>
										<span class="qna-index">Q{idx + 1}</span>
										<span class="qna-question-text">{qna.question}</span>
										<span class="qna-chevron" class:open={expandedQnAs[qna.id]}>▾</span>
									</button>

									{#if expandedQnAs[qna.id]}
										<div class="qna-body">
											{#if editingQnA?.qnaId === qna.id}
												<div class="edit-qna-form">
													<textarea
														class="edit-textarea"
														rows="2"
														placeholder="Question"
														bind:value={editQuestion}
													></textarea>
													<textarea
														class="edit-textarea"
														rows="4"
														placeholder="Answer"
														bind:value={editAnswer}
													></textarea>
													<div class="form-actions form-actions-sm">
														<button class="btn-primary btn-sm" onclick={saveEditQnA}>Save</button>
														<button class="btn-ghost btn-sm" onclick={() => (editingQnA = null)}>Cancel</button>
													</div>
												</div>
											{:else}
												<p class="qna-answer">{qna.answer || '—'}</p>
												<div class="qna-item-actions">
													<button class="action-btn edit" onclick={() => startEditQnA(interview.id, qna)}>✎ Edit</button>
													<button class="action-btn delete" onclick={() => deleteQnA(interview.id, qna.id)}>✕ Delete</button>
												</div>
											{/if}
										</div>
									{/if}
								</div>
							{/each}

							<!-- Add Q&A Form -->
							{#if addingQnAForClient === interview.id}
								<div class="add-qna-form">
									<div class="field">
										<label for="new-q">Question</label>
										<textarea
											id="new-q"
											rows="2"
											placeholder="What was asked..."
											bind:value={newQuestion}
										></textarea>
									</div>
									<div class="field">
										<label for="new-a">Answer / Notes</label>
										<textarea
											id="new-a"
											rows="4"
											placeholder="How you answered, ideal answer, key points..."
											bind:value={newAnswer}
										></textarea>
									</div>
									<div class="form-actions form-actions-sm">
										<button
											class="btn-primary btn-sm"
											onclick={() => addQnA(interview.id)}
											disabled={!newQuestion.trim()}
										>
											Save Question
										</button>
										<button class="btn-ghost btn-sm" onclick={cancelAddQnA}>Cancel</button>
									</div>
								</div>
							{:else}
								<button class="add-qna-btn" onclick={() => openAddQnA(interview.id)}>
									+ Add Question
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	/* ── Section shell ───────────────────────────────── */
	.ci-section {
		width: 100%;
		box-sizing: border-box;
		display: grid;
		gap: 1.2rem;
	}

	/* ── Header ──────────────────────────────────────── */
	.ci-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.ci-title-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.ci-title-group h2 {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 700;
		color: #1a2437;
	}

	.ci-subtitle {
		margin: 0.3rem 0 0;
		font-size: 0.88rem;
		color: #657389;
	}

	.premium-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: linear-gradient(135deg, #bf9b30, #f2d060, #bf9b30);
		background-size: 200% 200%;
		color: #3a2800;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		white-space: nowrap;
		animation: shimmer 3s ease infinite;
	}

	@keyframes shimmer {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}

	/* ── Add Client Button ───────────────────────────── */
	.add-client-btn {
		font-family: inherit;
		background: linear-gradient(135deg, #1a2437, #2c3e5a);
		color: #fff;
		border: none;
		border-radius: 12px;
		padding: 0.6rem 1.2rem;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.15s, transform 0.15s;
		box-shadow: 0 2px 10px rgba(26, 36, 55, 0.3);
	}

	.add-client-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	/* ── Form ────────────────────────────────────────── */
	.add-client-form {
		background: linear-gradient(135deg, #1a2437 0%, #1e3554 100%);
		border-radius: 16px;
		padding: 1.4rem;
		display: grid;
		gap: 1rem;
		box-shadow: 0 4px 24px rgba(26, 36, 55, 0.2);
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 0.9rem;
		align-items: end;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.field label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #a8bbd4;
	}

	.field input,
	.field textarea,
	.add-qna-form textarea,
	.edit-textarea {
		font-family: inherit;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		padding: 0.6rem 0.8rem;
		color: #fff;
		font-size: 0.88rem;
		resize: vertical;
		transition: border-color 0.15s;
		width: 100%;
		box-sizing: border-box;
	}

	.field input::placeholder,
	.add-qna-form textarea::placeholder,
	.edit-textarea::placeholder {
		color: rgba(255, 255, 255, 0.35);
	}

	.field input:focus,
	.add-qna-form textarea:focus,
	.edit-textarea:focus {
		outline: none;
		border-color: #f2b349;
	}

	.form-actions {
		display: flex;
		gap: 0.6rem;
		align-items: center;
	}

	.form-actions-sm {
		margin-top: 0.5rem;
	}

	/* ── Buttons ─────────────────────────────────────── */
	.btn-primary {
		font-family: inherit;
		background: linear-gradient(135deg, #ef791b, #f2b349);
		color: #fff;
		border: none;
		border-radius: 10px;
		padding: 0.55rem 1.2rem;
		font-size: 0.88rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s, transform 0.15s;
		white-space: nowrap;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.btn-primary:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-ghost {
		font-family: inherit;
		background: transparent;
		color: #a8bbd4;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		padding: 0.55rem 1rem;
		font-size: 0.88rem;
		cursor: pointer;
		transition: background 0.15s;
	}

	.btn-ghost:hover {
		background: rgba(255, 255, 255, 0.07);
	}

	.btn-sm {
		padding: 0.4rem 0.9rem;
		font-size: 0.82rem;
	}

	/* ── Action Buttons (edit / delete / save) ───────── */
	.action-btn {
		font-family: inherit;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 7px;
		padding: 0.25rem 0.55rem;
		font-size: 0.78rem;
		cursor: pointer;
		color: #99a8be;
		transition: background 0.13s, color 0.13s, border-color 0.13s;
		line-height: 1;
	}

	.action-btn.edit:hover {
		background: #eef4fb;
		color: #1a6bbf;
		border-color: #b8d0ec;
	}

	.action-btn.delete:hover {
		background: #fff0f0;
		color: #c0392b;
		border-color: #f0b8b8;
	}

	.action-btn.save:hover {
		background: #edfaf4;
		color: #1f7a57;
		border-color: #9dd9be;
	}

	/* ── Empty State ─────────────────────────────────── */
	.empty-state {
		background: #fff;
		border: 1px dashed #c8d4e2;
		border-radius: 16px;
		padding: 3rem 2rem;
		text-align: center;
		display: grid;
		place-items: center;
		gap: 0.6rem;
	}

	.empty-icon {
		font-size: 2.4rem;
		line-height: 1;
	}

	.empty-state h3 {
		margin: 0;
		font-size: 1.05rem;
		color: #1a2437;
	}

	.empty-state p {
		margin: 0;
		font-size: 0.88rem;
		color: #657389;
		max-width: 36ch;
	}

	/* ── Clients Grid ────────────────────────────────── */
	.clients-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 480px), 1fr));
		gap: 1rem;
	}

	/* ── Client Card ─────────────────────────────────── */
	.client-card {
		background: #fff;
		border: 1px solid #d8dee7;
		border-radius: 16px;
		overflow: hidden;
		transition: box-shadow 0.2s, border-color 0.2s;
	}

	.client-card.expanded {
		border-color: #b8c9e0;
		box-shadow: 0 4px 20px rgba(26, 36, 55, 0.1);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.85rem 1rem;
		background: linear-gradient(135deg, #1a2437 0%, #243352 100%);
	}

	.card-toggle {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		text-align: left;
		min-width: 0;
	}

	.client-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.client-avatar {
		width: 38px;
		height: 38px;
		border-radius: 12px;
		background: linear-gradient(135deg, #ef791b, #f2b349);
		color: #fff;
		font-size: 1.1rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.client-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	.client-name {
		font-size: 1rem;
		font-weight: 700;
		color: #fff;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.client-role {
		font-size: 0.78rem;
		color: #a8bbd4;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-header-right {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-shrink: 0;
	}

	.card-date {
		font-size: 0.72rem;
		color: #8899b4;
		white-space: nowrap;
	}

	.qna-count {
		background: rgba(242, 179, 73, 0.22);
		color: #f2c46a;
		border: 1px solid rgba(242, 179, 73, 0.3);
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.15rem 0.55rem;
		white-space: nowrap;
	}

	.chevron {
		color: #8899b4;
		font-size: 1rem;
		transition: transform 0.2s;
		display: inline-block;
	}

	.chevron.open {
		transform: rotate(180deg);
	}

	.card-actions {
		display: flex;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	/* ── Edit client inline ──────────────────────────── */
	.edit-client-inline {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.edit-input {
		font-family: inherit;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 7px;
		padding: 0.3rem 0.55rem;
		color: #fff;
		font-size: 0.85rem;
		width: 100%;
		box-sizing: border-box;
	}

	.edit-input:focus {
		outline: none;
		border-color: #f2b349;
	}

	.edit-input-sm {
		font-size: 0.75rem;
	}

	/* ── Q&A Section ─────────────────────────────────── */
	.qna-section {
		padding: 0.9rem 1rem;
		display: grid;
		gap: 0.6rem;
	}

	.no-qna {
		margin: 0;
		font-size: 0.84rem;
		color: #99a8be;
		font-style: italic;
	}

	/* ── Q&A Item ────────────────────────────────────── */
	.qna-item {
		border: 1px solid #e4ecf4;
		border-radius: 12px;
		overflow: hidden;
		background: #f9fbfd;
	}

	.qna-question-btn {
		width: 100%;
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		padding: 0.7rem 0.85rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		transition: background 0.13s;
	}

	.qna-question-btn:hover {
		background: #f0f5fb;
	}

	.qna-index {
		font-size: 0.68rem;
		font-weight: 700;
		background: linear-gradient(135deg, #1a2437, #2c3e5a);
		color: #fff;
		border-radius: 6px;
		padding: 0.2rem 0.45rem;
		white-space: nowrap;
		flex-shrink: 0;
		margin-top: 0.05rem;
		letter-spacing: 0.03em;
	}

	.qna-question-text {
		flex: 1;
		font-size: 0.87rem;
		font-weight: 600;
		color: #1a2437;
		line-height: 1.45;
	}

	.qna-chevron {
		color: #99a8be;
		font-size: 0.85rem;
		transition: transform 0.2s;
		display: inline-block;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	.qna-chevron.open {
		transform: rotate(180deg);
	}

	.qna-body {
		padding: 0 0.85rem 0.8rem;
		border-top: 1px solid #e4ecf4;
		background: #fff;
	}

	.qna-answer {
		margin: 0.7rem 0 0.5rem;
		font-size: 0.86rem;
		color: #3d4f66;
		line-height: 1.65;
		white-space: pre-wrap;
	}

	.qna-item-actions {
		display: flex;
		gap: 0.4rem;
	}

	/* ── Add Q&A Form ────────────────────────────────── */
	.add-qna-form {
		background: linear-gradient(135deg, #1a2437, #1e3554);
		border-radius: 12px;
		padding: 1rem;
		display: grid;
		gap: 0.75rem;
	}

	.add-qna-form .field label {
		color: #a8bbd4;
	}

	.add-qna-btn {
		font-family: inherit;
		background: transparent;
		border: 1.5px dashed #c8d8ec;
		border-radius: 10px;
		padding: 0.55rem 1rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: #6b84a4;
		cursor: pointer;
		width: 100%;
		text-align: center;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
	}

	.add-qna-btn:hover {
		background: #f0f5fb;
		border-color: #8ab0d4;
		color: #1a4d8f;
	}

	/* ── Edit Q&A form ───────────────────────────────── */
	.edit-qna-form {
		display: grid;
		gap: 0.6rem;
		padding-top: 0.6rem;
	}

	.edit-qna-form .edit-textarea {
		background: #f4f8fc;
		border: 1px solid #c8d8ec;
		color: #1a2437;
	}

	.edit-qna-form .edit-textarea::placeholder {
		color: #9bafc4;
	}

	.edit-qna-form .edit-textarea:focus {
		outline: none;
		border-color: #4a8fd4;
	}

	.edit-qna-form .btn-primary {
		background: linear-gradient(135deg, #1a6bbf, #2d8de0);
	}

	.edit-qna-form .btn-ghost {
		background: transparent;
		color: #6b84a4;
		border-color: #c8d8ec;
	}

	/* ── Responsive ──────────────────────────────────── */
	@media (max-width: 768px) {
		.ci-header {
			flex-direction: column;
			align-items: stretch;
		}

		.add-client-btn {
			width: 100%;
			text-align: center;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.field-date {
			grid-column: 1;
		}

		.clients-grid {
			grid-template-columns: 1fr;
		}

		.card-date {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.ci-title-group h2 {
			font-size: 1.15rem;
		}

		.add-client-form {
			padding: 1rem;
		}

		.card-header {
			padding: 0.75rem;
		}

		.qna-section {
			padding: 0.75rem;
		}
	}
</style>
