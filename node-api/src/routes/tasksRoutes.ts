import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository";
import ky from "ky";

const router = Router();
const tasksRepository = new TasksRepository();

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    // Validação dos campos
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    }

    const { lang } = req.body;
    if (!lang) {
      return res.status(400).json({ error: 'Campo "lang" é obrigatório.' });
    }
    if (lang != "pt" && lang != "en" && lang != "es") {
      return res.status(400).json({ error: 'Campo "lang" deve ser "pt", "en" ou "es".' });
    }

    // Cria a "tarefa"
    const task = tasksRepository.createTask(text, lang);

    // Deve solicitar o resumo do texto ao serviço Python
    const summary_api_res: { summary: string } = await ky.post('https://example.com', {json: {foo: true}}).json();

    // Atualiza a tarefa com o resumo
    tasksRepository.updateTask(task.id, summary_api_res.summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// GET: Lista todas as tarefas
router.get("/", (req, res) => {
  const tasks = tasksRepository.getAllTasks();
  return res.json(tasks);
});


// GET: Lista todas as tarefas
router.get("/:id", (req, res) => {
  const task_id = Number(req.params.id);
  const task = tasksRepository.getTaskById(task_id);
  return res.json(task);
});

export default router;
