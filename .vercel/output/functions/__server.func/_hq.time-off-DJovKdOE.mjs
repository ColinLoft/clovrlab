import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { br as CalendarOff } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell, o as UserCell } from "./_ssr/ResourcePage-CMf_zApm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.time-off-DJovKdOE.js
var import_jsx_runtime = require_jsx_runtime();
var cfg = {
	table: "hr_time_off",
	title: "Time Off",
	eyebrow: "People",
	icon: CalendarOff,
	itemName: "request",
	orderBy: {
		column: "start_date",
		ascending: false
	},
	searchable: ["type", "reason"],
	defaults: {
		status: "pending",
		type: "vacation"
	},
	kpis: (rows) => [
		{
			label: "Requests",
			value: rows.length,
			icon: CalendarOff
		},
		{
			label: "Pending",
			value: rows.filter((r) => r.status === "pending").length,
			icon: CalendarOff
		},
		{
			label: "Approved",
			value: rows.filter((r) => r.status === "approved").length,
			icon: CalendarOff
		}
	],
	columns: [
		{
			key: "user_id",
			label: "Person",
			render: (r, ctx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCell, {
				userId: r.user_id,
				profiles: ctx.profiles
			})
		},
		{
			key: "type",
			label: "Type",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: r.type })
		},
		{
			key: "start_date",
			label: "Start",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.start_date })
		},
		{
			key: "end_date",
			label: "End",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.end_date })
		},
		{
			key: "days",
			label: "Days"
		},
		{
			key: "status",
			label: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.status,
				palette: {
					pending: "border-amber-500/20 bg-amber-500/10 text-amber-600",
					approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
					denied: "border-destructive/20 bg-destructive/10 text-destructive"
				}
			})
		}
	],
	fields: [
		{
			key: "user_id",
			label: "Person",
			type: "user"
		},
		{
			key: "type",
			label: "Type",
			type: "select",
			options: [
				"vacation",
				"sick",
				"personal",
				"bereavement",
				"parental",
				"unpaid"
			].map((v) => ({
				value: v,
				label: v
			})),
			required: true
		},
		{
			key: "start_date",
			label: "Start date",
			type: "date",
			required: true
		},
		{
			key: "end_date",
			label: "End date",
			type: "date",
			required: true
		},
		{
			key: "days",
			label: "Days",
			type: "number"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				{
					value: "pending",
					label: "Pending"
				},
				{
					value: "approved",
					label: "Approved"
				},
				{
					value: "denied",
					label: "Denied"
				},
				{
					value: "cancelled",
					label: "Cancelled"
				}
			],
			required: true
		},
		{
			key: "approver_id",
			label: "Approver",
			type: "user"
		},
		{
			key: "reason",
			label: "Reason",
			type: "textarea",
			full: true
		}
	]
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config: cfg });
//#endregion
export { SplitComponent as component };
