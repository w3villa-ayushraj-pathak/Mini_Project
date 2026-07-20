import { motion } from "framer-motion";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-5">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
      >

        <div className="text-center">

          <h1 className="text-4xl font-bold text-gray-800">
            {title}
          </h1>

          <p className="text-gray-500 mt-3">
            {subtitle}
          </p>

        </div>

        <div className="mt-8">

          {children}

        </div>

      </motion.div>

    </div>
  );
}

export default AuthLayout;