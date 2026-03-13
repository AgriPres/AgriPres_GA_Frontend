import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

type AdminUser = {
	id: string;
	name: string;
	memberId?: string;
};

type HourRecord = {
	localId: string;
	idRegistro: number;
	fecha: string;
	numeroHoras: number;
	isNew?: boolean;
};

type BackendObject = Record<string, unknown>;

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const ADMIN_USERS_ENDPOINT = import.meta.env.VITE_ADMIN_USERS_ENDPOINT ?? '/api/admin/users';
const ADMIN_RECORDS_ENDPOINT = import.meta.env.VITE_ADMIN_RECORDS_ENDPOINT ?? '/api/admin/registros-horas';

const toNumber = (value: unknown): number => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
	if (typeof value === 'string') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	return 0;
};

const toStringSafe = (value: unknown): string => {
	if (typeof value === 'string') return value;
	if (typeof value === 'number') return String(value);
	return '';
};

const formatDate = (isoDate: string): string => {
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) return isoDate;
	return parsed.toLocaleDateString('es-ES');
};

const toInputDate = (value: string): string => {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return '';
	return parsed.toISOString().slice(0, 10);
};

const getTodayInputDate = (): string => {
	const now = new Date();
	const yyyy = now.getFullYear();
	const mm = String(now.getMonth() + 1).padStart(2, '0');
	const dd = String(now.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
};

const normalizeUser = (user: BackendObject, index: number): AdminUser => {
	const id = toStringSafe(user.id ?? user.userId ?? user.socio_id ?? user.memberId ?? index + 1);
	const name = toStringSafe(user.name ?? user.nombre ?? user.username ?? user.email ?? `Usuario ${index + 1}`);
	const memberId = toStringSafe(user.memberId ?? user.member_id ?? user.socio_id ?? user.idSocio);

	return {
		id,
		name,
		memberId: memberId || undefined,
	};
};

const normalizeRecord = (record: BackendObject, index: number): HourRecord => {
	const idRegistro = toNumber(record.idRegistro ?? record.id_registro ?? record.id ?? index + 1);
	const rawFecha = record.fecha ?? record.date ?? record.created_at ?? record.createdAt ?? new Date().toISOString();
	const fecha = typeof rawFecha === 'string' ? rawFecha : new Date(rawFecha as number).toISOString();
	const numeroHoras = toNumber(record.numeroHoras ?? record.numero_horas ?? record.horas ?? record.hours ?? 0);

	return {
		localId: String(idRegistro),
		idRegistro,
		fecha,
		numeroHoras,
	};
};

const DashboardAdmin = () => {
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [selectedUserId, setSelectedUserId] = useState('');
	const [records, setRecords] = useState<HourRecord[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [loadingRecords, setLoadingRecords] = useState(false);
	const [error, setError] = useState('');
	const [infoMessage, setInfoMessage] = useState('');
	const [savingRows, setSavingRows] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const fetchUsers = async () => {
			setLoadingUsers(true);
			setError('');

			try {
				const response = await api.get(ADMIN_USERS_ENDPOINT);
				const rawData: unknown = response.data?.data ?? response.data?.users ?? response.data;
				const list = Array.isArray(rawData) ? rawData : [];
				const normalizedUsers = list.map((item, index) => normalizeUser(item as BackendObject, index));

				setUsers(normalizedUsers);
				if (normalizedUsers.length > 0) {
					setSelectedUserId(normalizedUsers[0].id);
				}
			} catch {
				setError('No se pudieron cargar los usuarios para gestionar.');
			} finally {
				setLoadingUsers(false);
			}
		};

		fetchUsers();
	}, []);

	useEffect(() => {
		if (!selectedUserId) {
			setRecords([]);
			return;
		}

		const fetchUserRecords = async () => {
			setLoadingRecords(true);
			setError('');

			try {
				const response = await api.get(ADMIN_RECORDS_ENDPOINT, {
					params: { userId: selectedUserId },
				});

				const rawData: unknown = response.data?.data ?? response.data?.records ?? response.data;
				const list = Array.isArray(rawData) ? rawData : [];
				const normalizedRecords = list
					.map((item, index) => normalizeRecord(item as BackendObject, index))
					.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

				setRecords(normalizedRecords);
			} catch {
				setError('No se pudieron cargar los registros del usuario seleccionado.');
			} finally {
				setLoadingRecords(false);
			}
		};

		fetchUserRecords();
	}, [selectedUserId]);

	const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;

	const handleCellChange = (localId: string, field: 'fecha' | 'numeroHoras', value: string) => {
		setRecords((prev) =>
			prev.map((record) => {
				if (record.localId !== localId) return record;
				if (field === 'numeroHoras') {
					return {
						...record,
						numeroHoras: toNumber(value),
					};
				}
				return {
					...record,
					fecha: value,
				};
			}),
		);
	};

	const handleAddRow = () => {
		const timestamp = Date.now();
		setRecords((prev) => [
			...prev,
			{
				localId: `new-${timestamp}`,
				idRegistro: 0,
				fecha: getTodayInputDate(),
				numeroHoras: 0,
				isNew: true,
			},
		]);
		setInfoMessage('Fila nueva añadida. Guarda para enviarla a la base de datos.');
	};

	const saveRow = async (record: HourRecord) => {
		if (!selectedUserId) {
			setError('Selecciona un usuario antes de guardar cambios.');
			return;
		}

		if (!record.fecha) {
			setError('La fecha es obligatoria para guardar una fila.');
			return;
		}

		setSavingRows((prev) => ({ ...prev, [record.localId]: true }));
		setError('');
		setInfoMessage('');

		try {
			if (record.isNew) {
				const response = await api.post(ADMIN_RECORDS_ENDPOINT, {
					userId: selectedUserId,
					fecha: record.fecha,
					numeroHoras: record.numeroHoras,
				});

				const rawCreated: unknown = response.data?.data ?? response.data?.record ?? response.data;
				const normalizedCreated = normalizeRecord(rawCreated as BackendObject, records.length + 1);

				setRecords((prev) =>
					prev.map((row) => {
						if (row.localId !== record.localId) return row;
						return normalizedCreated;
					}),
				);
				setInfoMessage('Fila creada y guardada en PostgreSQL.');
			} else {
				await api.put(`${ADMIN_RECORDS_ENDPOINT}/${record.idRegistro}`, {
					userId: selectedUserId,
					fecha: record.fecha,
					numeroHoras: record.numeroHoras,
				});
				setInfoMessage(`Registro ${record.idRegistro} actualizado en PostgreSQL.`);
			}
		} catch {
			setError('No se pudo guardar la fila en la base de datos.');
		} finally {
			setSavingRows((prev) => ({ ...prev, [record.localId]: false }));
		}
	};

	const monthlyHours = useMemo(() => {
		const totals = new Array(12).fill(0) as number[];

		for (const record of records) {
			const date = new Date(record.fecha);
			if (Number.isNaN(date.getTime())) continue;
			const month = date.getMonth();
			totals[month] += record.numeroHoras;
		}

		return totals.map((total, month) => ({
			monthLabel: MONTH_LABELS[month],
			hours: Number(total.toFixed(2)),
		}));
	}, [records]);

	const maxHours = Math.max(...monthlyHours.map((item) => item.hours), 1);
	const chartWidth = 920;
	const chartHeight = 340;
	const padding = 44;
	const drawableWidth = chartWidth - padding * 2;
	const drawableHeight = chartHeight - padding * 2;

	const points = monthlyHours
		.map((item, index) => {
			const x = padding + (index / 11) * drawableWidth;
			const y = padding + ((maxHours - item.hours) / maxHours) * drawableHeight;
			return `${x},${y}`;
		})
		.join(' ');

	if (loadingUsers) {
		return (
			<div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center text-slate-700">
				Cargando dashboard de administrador...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="max-w-[1400px] mx-auto space-y-8">
				<section className="bg-white rounded-xl shadow-md p-6 mt-20 max-w-3xl mx-auto text-center">
					<h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
					<p className="mt-2 text-slate-600">Selecciona el usuario que quieres gestionar.</p>
					<div className="mt-5 max-w-md mx-auto text-left">
						<label htmlFor="managedUser" className="block text-lg font-bold text-slate-900 mb-2 text-center">
							Usuario
						</label>
						<select
							id="managedUser"
							value={selectedUserId}
							onChange={(event) => setSelectedUserId(event.target.value)}
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400"
						>
							{users.length === 0 ? (
								<option value="">No hay usuarios disponibles</option>
							) : (
								users.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name}
									</option>
								))
							)}
						</select>
					</div>
					{selectedUser && (
						<div className="mt-4 text-sm text-slate-600">
							Gestionando: <span className="font-semibold text-slate-900">{selectedUser.name}</span>
							{selectedUser.memberId ? (
								<>
									 {' '}· ID socio:{' '}
									<span className="font-semibold text-slate-900">{selectedUser.memberId}</span>
								</>
							) : null}
						</div>
					)}
				</section>

				{error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
				{infoMessage ? <p className="text-center text-sm text-emerald-700">{infoMessage}</p> : null}

				<div className="grid grid-cols-1 gap-8 xl:grid-cols-2 items-start justify-items-center">
					<section className="bg-white rounded-xl shadow-md p-7 w-full max-w-[680px]">
						<div className="flex items-center justify-between mb-5">
							<h2 className="text-2xl font-bold text-slate-900 text-center w-full">Registros de horas</h2>
						</div>

						<div className="mb-4 flex justify-center">
							<button
								type="button"
								onClick={handleAddRow}
								disabled={!selectedUserId || loadingRecords}
								className="bg-lime-500 hover:bg-lime-400 disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-900 font-semibold px-4 py-2 rounded-lg transition"
							>
								Añadir fila
							</button>
						</div>

						{loadingRecords ? (
							<p className="text-center text-slate-600 py-8">Cargando registros del usuario...</p>
						) : (
							<table className="w-full border border-slate-200 rounded-lg overflow-hidden">
								<thead className="bg-slate-100 text-slate-700">
									<tr>
										<th className="px-3 py-3 text-center font-semibold">ID registro</th>
										<th className="px-3 py-3 text-center font-semibold">Fecha</th>
										<th className="px-3 py-3 text-center font-semibold">Número de horas</th>
										<th className="px-3 py-3 text-center font-semibold">Acción</th>
									</tr>
								</thead>
								<tbody>
									{records.length === 0 ? (
										<tr>
											<td colSpan={4} className="px-4 py-6 text-center text-slate-500">
												No hay registros para este usuario.
											</td>
										</tr>
									) : (
										records.map((record) => {
											const isSaving = Boolean(savingRows[record.localId]);

											return (
												<tr key={record.localId} className="border-t border-slate-200">
													<td className="px-3 py-3 text-slate-800 text-center">
														{record.isNew ? 'Nuevo' : record.idRegistro}
													</td>
													<td className="px-3 py-3 text-center">
														<input
															type="date"
															value={toInputDate(record.fecha)}
															onChange={(event) => handleCellChange(record.localId, 'fecha', event.target.value)}
															className="w-full rounded border border-slate-300 px-2 py-1 text-slate-900"
														/>
													</td>
													<td className="px-3 py-3 text-center">
														<input
															type="number"
															step="0.25"
															min="0"
															value={record.numeroHoras}
															onChange={(event) => handleCellChange(record.localId, 'numeroHoras', event.target.value)}
															className="w-full rounded border border-slate-300 px-2 py-1 text-slate-900 text-center"
														/>
													</td>
													<td className="px-3 py-3 text-center">
														<button
															type="button"
															onClick={() => saveRow(record)}
															disabled={isSaving || loadingRecords}
															className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded transition"
														>
															{isSaving ? 'Guardando...' : 'Guardar'}
														</button>
													</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						)}
					</section>

					<section className="bg-white rounded-xl shadow-md p-7 w-full max-w-[680px]">
						<h2 className="text-2xl font-bold text-slate-900 mb-5 text-center">Histórico mensual de horas</h2>

						<div className="w-full">
							<svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
								<line
									x1={padding}
									y1={chartHeight - padding}
									x2={chartWidth - padding}
									y2={chartHeight - padding}
									stroke="#94a3b8"
									strokeWidth="1"
								/>
								<line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#94a3b8" strokeWidth="1" />
								<polyline fill="none" stroke="#2563eb" strokeWidth="3" points={points} />

								{monthlyHours.map((item, index) => {
									const x = padding + (index / 11) * drawableWidth;
									const y = padding + ((maxHours - item.hours) / maxHours) * drawableHeight;

									return (
										<g key={item.monthLabel}>
											<circle cx={x} cy={y} r="4" fill="#2563eb" />
											<text x={x} y={chartHeight - padding + 22} textAnchor="middle" fontSize="13" fill="#334155">
												{item.monthLabel}
											</text>
										</g>
									);
								})}

								<text x={padding - 10} y={padding - 10} textAnchor="end" fontSize="12" fill="#475569">
									{maxHours}
								</text>
								<text x={padding - 10} y={chartHeight - padding + 4} textAnchor="end" fontSize="12" fill="#475569">
									0
								</text>
							</svg>
						</div>

						<p className="text-sm text-slate-600 mt-3 text-center">
							Eje X: meses del año · Eje Y: número de horas acumuladas por mes.
						</p>
						{records.length > 0 ? (
							<p className="text-xs text-slate-500 mt-2 text-center">
								Último registro: {formatDate(records[records.length - 1].fecha)}
							</p>
						) : null}
					</section>
				</div>
			</div>
		</div>
	);
};

export default DashboardAdmin;
