import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Container } from '@/components/layout/Container'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <PageWrapper centered className="bg-gradient-to-br from-background via-background to-muted">
      <Container size="sm">
        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center space-y-3 sm:space-y-4 px-6 sm:px-8 pt-8 sm:pt-10">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive" />
            </div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              We encountered an issue while signing you in
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 sm:space-y-7 px-6 sm:px-8 pb-8 sm:pb-10">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                This could happen if:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>The authentication link expired</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>The link was already used</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>There was a network issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>The authentication was cancelled</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/login" className="block">
                <Button className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                If this problem persists, please{' '}
                <a href="#" className="text-primary hover:underline">
                  contact support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </PageWrapper>
  )
}

