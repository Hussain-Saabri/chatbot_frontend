import MedicalDashboard from "@/components/layout/MedicalDashboard";

export const metadata = {
    title: "Dr. Nova AI | Next-Gen Medical Analysis",
    description: "Experience the pulse of futuristic healthcare with Dr. Nova AI.",
};

export default function DrNovaPage() {
    return (
        <div className="bg-app min-h-screen">
            <MedicalDashboard />
        </div>
    );
}
