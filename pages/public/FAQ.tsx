import React from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "How much of my donation actually goes to the field?",
    a: "We are committed to efficiency. 85% of all expenses go directly to program services. 10% is allocated to fundraising to sustain growth, and 5% covers administrative overhead."
  },
  {
    q: "Is my donation tax-deductible?",
    a: "Yes. GiveHope is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the full extent of the law in the United States."
  },
  {
    q: "Can I designate my gift to a specific project?",
    a: "Absolutely. You can choose to support a specific field worker, a regional fund (e.g., East Africa), or a thematic fund (e.g., Clean Water). Undesignated gifts go to the 'Where Needed Most' fund."
  },
  {
    q: "How do you vet your field partners?",
    a: "We have a rigorous 5-step vetting process including background checks, financial audits, theological alignment reviews, and on-site visits before any partnership is formalized."
  },
  {
    q: "Do you accept physical goods?",
    a: "Generally, no. Shipping physical goods is often cost-prohibitive and inefficient. We prioritize cash grants which allow local partners to purchase supplies within their own economies, stimulating local growth."
  }
];

interface AccordionItemProps {
  q: string;
  a: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ q, a, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className={`text-xl font-medium transition-colors duration-300 ${isOpen ? 'text-blue-600' : 'text-slate-900 group-hover:text-slate-600'}`}>
          {q}
        </span>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-lg text-slate-500 leading-relaxed pr-12 font-light">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      <section className="bg-white py-24 border-b border-slate-200">
        <div className="container mx-auto px-6 text-center max-w-4xl">
           <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-100 text-slate-900 mb-6">
              <HelpCircle className="h-6 w-6" />
           </div>
          <h1 className="text-5xl font-bold tracking-tighter text-slate-900 mb-6">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl text-slate-500 font-light text-balance">
            Transparency is key. Here are answers to the most common questions about our operations and your impact.
          </p>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
           {faqs.map((item, i) => (
             <AccordionItem 
               key={i} 
               q={item.q} 
               a={item.a} 
               isOpen={openIndex === i}
               onClick={() => setOpenIndex(openIndex === i ? null : i)}
             />
           ))}
        </div>
      </section>
    </div>
  );
};