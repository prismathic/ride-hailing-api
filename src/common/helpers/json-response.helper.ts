export class JsonResponse {
  static create(message: string, result?: any) {
    return { message, result };
  }
}
