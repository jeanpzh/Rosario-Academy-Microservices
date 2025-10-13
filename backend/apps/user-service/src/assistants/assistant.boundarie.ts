export abstract class AssistantRepository {
  abstract findAll(): Promise<any[]>
  abstract findById(id: string): Promise<any | null>
  abstract createAssistant(data: any): Promise<any>
  abstract updateAssistant(id: string, dto: any): Promise<any>
  abstract deleteAssistant(id: string): Promise<any>
}
