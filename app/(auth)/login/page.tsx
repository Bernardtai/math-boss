import { LoginButton } from '@/components/auth/LoginButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Math Boss</h1>
          <p className="mt-2 text-sm text-gray-600">
            Master math with the Asian method
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sign in to your account
              </h2>
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
