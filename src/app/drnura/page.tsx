import MedicalDashboard from "@/components/layout/MedicalDashboard";

export const metadata = {
    title: "Dr. Nura AI | Next-Gen Medical Analysis",
    description: "Experience the pulse of futuristic healthcare with Dr. Nura AI.",
};

export default function DrNuraPage() {
    return (
        <div className="bg-app min-h-screen">
            <MedicalDashboard />
        </div>
    );
}
