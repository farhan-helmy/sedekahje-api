import { Schema, model } from "mongoose";

// Interface for Institution
export interface IInstitution {
  id?: number;
  name: string;
  category: string;
  state: string;
  city: string;
  qrImage: string;
  qrContent: string;
  supportedPayment: string[];
  coords: number[];
  slug?: string;
}

// Schema for Institution
const institutionSchema = new Schema<IInstitution>(
  {
    id: { type: Number },
    name: { type: String, required: true },
    category: { type: String },
    state: { type: String },
    city: { type: String },
    qrImage: { type: String },
    qrContent: { type: String },
    supportedPayment: { type: [String] },
    coords: { type: [Number], length: 2 },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// Generate slug from name before saving
institutionSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

// Export the model
const Institution = model<IInstitution>("Institution", institutionSchema);

export default Institution;
