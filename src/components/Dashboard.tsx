import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

type HourRecord = {
	idRegistro: number;
	fecha: string;
	numeroHoras: number;
};

type BackendRecord = Record<string, unknown>;

const MONTH_LABELS = [
	'Ene',
	'Feb',
	'Mar',
	'Abr',
	'May',
	'Jun',
	'Jul',
	'Ago',
	'Sep',
	'Oct',
	'Nov',
	'Dic',
];

const DASHBOARD_ENDPOINT = import.meta.env.VITE_DASHBOARD_ENDPOINT ?? '/api/registros-horas';

const getNumericValue = (value: unknown): number => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
	if (typeof value === 'string') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	return 0;
};

const normalizeRecord = (record: BackendRecord, index: number): HourRecord => {
	const idRegistro = getNumericValue(
		record.idRegistro ?? record.id_registro ?? record.id ?? index + 1,
	);

	const rawFecha =
		record.fecha ??
		record.date ??
		record.created_at ??
		record.createdAt ??
		new Date().toISOString();

	const fecha = typeof rawFecha === 'string' ? rawFecha : new Date(rawFecha as number).toISOString();

	const numeroHoras = getNumericValue(
		record.numeroHoras ?? record.numero_horas ?? record.horas ?? record.hours ?? 0,
	);

	return {
		idRegistro,
		fecha,
		numeroHoras,
	};
};

const formatDate = (isoDate: string) => {
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) return isoDate;
	return parsed.toLocaleDateString('es-ES');
};

const Dashboard = () => {
	const { user } = useAuth();
	const [records, setRecords] = useState<HourRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchDashboardData = async () => {
			setLoading(true);
			setError('');

			try {
				const response = await api.get(DASHBOARD_ENDPOINT);

				const rawData: unknown = response.data?.data ?? response.data?.records ?? response.data;
				const list = Array.isArray(rawData) ? rawData : [];

				const normalized = list
					.map((item, index) => normalizeRecord(item as BackendRecord, index))
					.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

				setRecords(normalized);
			} catch {
				setError('No se pudieron cargar los datos del dashboard.');
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

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

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center text-slate-700">
				Cargando dashboard...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="max-w-[1400px] mx-auto space-y-8">
				<section className="bg-white rounded-xl shadow-md p-6 mt-20 max-w-3xl mx-auto text-center">
					<h1 className="text-2xl font-bold text-slate-900">Datos del socio</h1>
					<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-800">
						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<p className="text-sm text-slate-500">Nombre</p>
							<p className="text-lg font-semibold">{user?.name ?? 'Sin datos'}</p>
						</div>
						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<p className="text-sm text-slate-500">ID de socio</p>
							<p className="text-lg font-semibold">{user?.id ?? 'Sin datos'}</p>
						</div>
					</div>
				</section>

				<div className="grid grid-cols-1 gap-8 xl:grid-cols-2 items-start justify-items-center">
					<section className="bg-white rounded-xl shadow-md p-7 w-full max-w-[680px]">
						<h2 className="text-2xl font-bold text-slate-900 mb-5 text-center">Registros de horas</h2>

						{error && <p className="text-sm text-red-600 mb-3 text-center">{error}</p>}

						<table className="w-full border border-slate-200 rounded-lg overflow-hidden">
							<thead className="bg-slate-100 text-slate-700">
								<tr>
									<th className="px-5 py-4 text-center font-semibold">ID registro</th>
									<th className="px-5 py-4 text-center font-semibold">Fecha</th>
									<th className="px-5 py-4 text-center font-semibold">Número de horas</th>
								</tr>
							</thead>
							<tbody>
								{records.length === 0 ? (
									<tr>
										<td colSpan={3} className="px-4 py-6 text-center text-slate-500">
											No hay registros para mostrar.
										</td>
									</tr>
								) : (
									records.map((record) => (
										<tr key={`${record.idRegistro}-${record.fecha}`} className="border-t border-slate-200">
											<td className="px-5 py-4 text-slate-800 text-center">{record.idRegistro}</td>
											<td className="px-5 py-4 text-slate-800 text-center">{formatDate(record.fecha)}</td>
											<td className="px-5 py-4 text-slate-800 text-center">{record.numeroHoras}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
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
					</section>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
