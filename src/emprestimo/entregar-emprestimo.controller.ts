import { Controller, NotFoundException, Param, Put } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/emprestimo')
export class EmprestimoEntregueController {
    constructor(private readonly prismaService: PrismaService) { }

    @Put(':id/entregar')
    async confirmarEntrega(@Param('id') id: number) {
        try {
            const emprestimo = await this.prismaService.emprestimo.findUnique({
                where: { id },
                include: { livro: true }
            });

            if (!emprestimo) {
                throw new NotFoundException(`Empréstimo com o ID ${id} não encontrado.`);
            }

            const emprestigoEntregue = await this.prismaService.emprestimo.update({
                where: { id },
                data: { entregue: true, data_entregue: new Date() }
            });

            if (emprestimo.livroId) {
                await this.prismaService.livros.update({
                    where: { id: emprestimo.livro.id },
                    data: { quantidade_disponivel: emprestimo.livro.quantidade_disponivel + 1 }
                });
            }

            return { message: 'Livro marcado como entregue!', data: emprestigoEntregue };
        } catch (error) {
            console.error(error);
            return { message: 'Erro ao confirmar entrega do livro.', error };
        }
    }
}
