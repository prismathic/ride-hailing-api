export class JsonResponse {
  static create(message: string, response?: any) {
    return { message, response };
  }
}
