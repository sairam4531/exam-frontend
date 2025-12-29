import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, X, ArrowLeft, RefreshCw, Users, FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamResponse {
  id: number;
  roll_number: string;
  name: string;
  department: string;
  section: string;
  score: number;
  total_questions: number;
  was_tab_switched: boolean;
  submitted_at: string;
}

const API_BASE_URL = "https://exam-server-aynr.onrender.com/api";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: 0
  });

  useEffect(() => {
    fetchQuestions();
    fetchResponses();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    setResponsesLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/responses`);
      const data = await res.json();
      if (data.success) {
        setResponses(data.data);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast({
        title: "Error",
        description: "Failed to load responses",
        variant: "destructive"
      });
    } finally {
      setResponsesLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.question || !formData.option1 || !formData.option2 || !formData.option3 || !formData.option4) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: formData.question,
          options: [formData.option1, formData.option2, formData.option3, formData.option4],
          correct_answer: formData.correctAnswer
        })
      });
      
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Question added successfully" });
        setShowAddForm(false);
        resetForm();
        fetchQuestions();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add question", variant: "destructive" });
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: formData.question,
          options: [formData.option1, formData.option2, formData.option3, formData.option4],
          correct_answer: formData.correctAnswer
        })
      });
      
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Question updated successfully" });
        setEditingId(null);
        resetForm();
        fetchQuestions();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update question", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: "DELETE"
      });
      
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Question deleted successfully" });
        fetchQuestions();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete question", variant: "destructive" });
    }
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setFormData({
      question: q.question,
      option1: q.options[0],
      option2: q.options[1],
      option3: q.options[2],
      option4: q.options[3],
      correctAnswer: q.correctAnswer
    });
  };

  const resetForm = () => {
    setFormData({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: 0
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exam
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Portal</h1>
          <div className="w-[100px]"></div>
        </div>

        <Tabs defaultValue="responses" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
            <TabsTrigger value="responses" className="data-[state=active]:bg-white/20 text-white">
              <Users className="mr-2 h-4 w-4" /> Exam Responses
            </TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-white/20 text-white">
              <FileQuestion className="mr-2 h-4 w-4" /> Question Management
            </TabsTrigger>
          </TabsList>

          {/* Responses Tab */}
          <TabsContent value="responses">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Exam Responses ({responses.length})</CardTitle>
                <Button 
                  onClick={fetchResponses} 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                  disabled={responsesLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${responsesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {responses.length === 0 ? (
                  <div className="text-center text-white/60 py-8">
                    No exam responses yet. Responses will appear here when students submit their exams.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20 hover:bg-white/5">
                          <TableHead className="text-white/80">Roll Number</TableHead>
                          <TableHead className="text-white/80">Name</TableHead>
                          <TableHead className="text-white/80">Department</TableHead>
                          <TableHead className="text-white/80">Section</TableHead>
                          <TableHead className="text-white/80">Score</TableHead>
                          <TableHead className="text-white/80">Tab Switched</TableHead>
                          <TableHead className="text-white/80">Submitted At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {responses.map((response) => (
                          <TableRow key={response.id} className="border-white/10 hover:bg-white/5">
                            <TableCell className="text-white font-medium">{response.roll_number}</TableCell>
                            <TableCell className="text-white/90">{response.name}</TableCell>
                            <TableCell className="text-white/90">{response.department}</TableCell>
                            <TableCell className="text-white/90">{response.section}</TableCell>
                            <TableCell>
                              <span className={`font-bold ${
                                response.score >= response.total_questions * 0.7 
                                  ? 'text-green-400' 
                                  : response.score >= response.total_questions * 0.4 
                                    ? 'text-yellow-400' 
                                    : 'text-red-400'
                              }`}>
                                {response.score}/{response.total_questions}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${
                                response.was_tab_switched 
                                  ? 'bg-red-500/30 text-red-300' 
                                  : 'bg-green-500/30 text-green-300'
                              }`}>
                                {response.was_tab_switched ? 'Yes' : 'No'}
                              </span>
                            </TableCell>
                            <TableCell className="text-white/70 text-sm">
                              {formatDate(response.submitted_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => { setShowAddForm(true); resetForm(); }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </div>

            {/* Add Question Form */}
            {showAddForm && (
              <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Add New Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Question</Label>
                    <Textarea
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      placeholder="Enter your question..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num}>
                        <Label className="text-white flex items-center gap-2">
                          Option {num}
                          <input
                            type="radio"
                            name="correct"
                            checked={formData.correctAnswer === num - 1}
                            onChange={() => setFormData({ ...formData, correctAnswer: num - 1 })}
                            className="ml-2"
                          />
                          <span className="text-xs text-green-400">Correct</span>
                        </Label>
                        <Input
                          value={formData[`option${num}` as keyof typeof formData] as string}
                          onChange={(e) => setFormData({ ...formData, [`option${num}`]: e.target.value })}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                          placeholder={`Option ${num}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
                      <Save className="mr-2 h-4 w-4" /> Save Question
                    </Button>
                    <Button onClick={cancelEdit} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {questions.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-8 text-center text-white">
                    No questions found. Add your first question!
                  </CardContent>
                </Card>
              ) : (
                questions.map((q, index) => (
                  <Card key={q.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      {editingId === q.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-white">Question</Label>
                            <Textarea
                              value={formData.question}
                              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                              className="bg-white/20 border-white/30 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                              <div key={num}>
                                <Label className="text-white flex items-center gap-2">
                                  Option {num}
                                  <input
                                    type="radio"
                                    name={`correct-${q.id}`}
                                    checked={formData.correctAnswer === num - 1}
                                    onChange={() => setFormData({ ...formData, correctAnswer: num - 1 })}
                                    className="ml-2"
                                  />
                                  <span className="text-xs text-green-400">Correct</span>
                                </Label>
                                <Input
                                  value={formData[`option${num}` as keyof typeof formData] as string}
                                  onChange={(e) => setFormData({ ...formData, [`option${num}`]: e.target.value })}
                                  className="bg-white/20 border-white/30 text-white"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleUpdate(q.id)} className="bg-blue-600 hover:bg-blue-700">
                              <Save className="mr-2 h-4 w-4" /> Update
                            </Button>
                            <Button onClick={cancelEdit} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                              <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-white font-semibold">
                              Q{index + 1}: {q.question}
                            </h3>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                onClick={() => startEdit(q)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                onClick={() => handleDelete(q.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt, i) => (
                              <div 
                                key={i} 
                                className={`p-2 rounded text-sm ${
                                  i === q.correctAnswer 
                                    ? "bg-green-500/30 text-green-200 border border-green-500/50" 
                                    : "bg-white/10 text-white/80"
                                }`}
                              >
                                {String.fromCharCode(65 + i)}. {opt}
                                {i === q.correctAnswer && <span className="ml-2 text-xs">(Correct)</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="mt-6 text-center text-white/60 text-sm">
              Total Questions: {questions.length}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
