import React from "react";

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="group relative rounded-2xl bg-card/50 p-6 transition-all duration-300 hover:bg-card hover:shadow-lg">
      <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 blur transition duration-300 group-hover:opacity-100" />
      <div className="mb-4 flex justify-center">
        <div className="relative rounded-xl bg-primary/10 p-3 ring-2 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/30">
          <Icon className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      <h3 className="mb-2 text-center text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-center text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureItem;
