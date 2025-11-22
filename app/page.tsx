'use client'

import React, { useState, useEffect } from 'react';

interface Solicitacao {
  id: number;
  nome: string;
  setor: string;
  operacao: string;
  descricao: string;
  turno: number;
  horario: string;
  data: string;
  status: string;
  alinhador: string | null;
  observacao: string;
  horaInicio: string | null;
  horaFim: string | null;
}

interface EditandoItem {
  tipo: string | null;
  index: number | null;
  valor: string;
}

const CORES_SETORES = {
  'Movis Automática': 'bg-blue-500',
  'Movis Manual': 'bg-cyan-500',
  'Envase Automática': 'bg-green-500',
  'Envase Manual': 'bg-lime-500',
  'Mistura Automática': 'bg-purple-500',
  'Mistura Manual': 'bg-pink-500'
};

const CORES_ALINHADORES_DEFAULT = {
  'Alinhador 1': 'bg-orange-500',
  'Alinhador 2': 'bg-yellow-500',
  'Alinhador 3': 'bg-red-500'
};

const TURNOS = {
  1: '07:00 - 15:00',
  2: '15:00 - 00:00',
  3: '00:00 - 07:00'
};

export default function App() {
  const [tela, setTela] = useState('solicitante');
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [nome, setNome] = useState('');
  const [setor, setSetor] = useState('');
  const [operacao, setOperacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [filtroSetor, setFiltroSetor] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  
  const [solicitantes, setSolicitantes] = useState(['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira']);
  const [alinhadores, setAlinhadores] = useState(['Alinhador 1', 'Alinhador 2', 'Alinhador 3']);
  const [coresAlinhadores, setCoresAlinhadores] = useState(CORES_ALINHADORES_DEFAULT);
  const [tiposManobra, setTiposManobra] = useState([
    'Abertura de Válvula Intermediária',
    'Válvula Base de Tanque',
    'Conexão de Mangote',
    'Boquilha'
  ]);

  const [novoSolicitante, setNovoSolicitante] = useState('');
  const [novoAlinhador, setNovoAlinhador] = useState('');
  const [novaManobra, setNovaManobra] = useState('');
  const [editandoItem, setEditandoItem] = useState<EditandoItem>({ tipo: null, index: null, valor: '' });
  const [inputEmEdicao, setInputEmEdicao] = useState('');

  useEffect(() => {
    const dados = localStorage.getItem('solicitacoes');
    const dadosSolicitantes = localStorage.getItem('solicitantes');
    const dadosAlinhadores = localStorage.getItem('alinhadores');
    const dadosManobras = localStorage.getItem('tiposManobra');
    const dadosCoresAlinhadores = localStorage.getItem('coresAlinhadores');
    
    if (dados) setSolicitacoes(JSON.parse(dados));
    if (dadosSolicitantes) setSolicitantes(JSON.parse(dadosSolicitantes));
    if (dadosAlinhadores) setAlinhadores(JSON.parse(dadosAlinhadores));
    if (dadosManobras) setTiposManobra(JSON.parse(dadosManobras));
    if (dadosCoresAlinhadores) setCoresAlinhadores(JSON.parse(dadosCoresAlinhadores));
  }, []);

  useEffect(() => {
    localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
  }, [solicitacoes]);

  useEffect(() => {
    localStorage.setItem('solicitantes', JSON.stringify(solicitantes));
  }, [solicitantes]);

  useEffect(() => {
    localStorage.setItem('alinhadores', JSON.stringify(alinhadores));
    localStorage.setItem('coresAlinhadores', JSON.stringify(coresAlinhadores));
  }, [alinhadores, coresAlinhadores]);

  useEffect(() => {
    localStorage.setItem('tiposManobra', JSON.stringify(tiposManobra));
  }, [tiposManobra]);

  const getTurnoAtual = () => {
    const hora = new Date().getHours();
    if (hora >= 7 && hora < 15) return 1;
    if (hora >= 15 && hora < 24) return 2;
    return 3;
  };

  const criarSolicitacao = () => {
    if (!nome || !setor || !operacao || !descricao) {
      alert('Preencha todos os campos!');
      return;
    }

    const novaSolicitacao = {
      id: Date.now(),
      nome,
      setor,
      operacao,
      descricao,
      turno: getTurnoAtual(),
      horario: new Date().toLocaleTimeString('pt-BR'),
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'Pendente',
      alinhador: null,
      observacao: '',
      horaInicio: null,
      horaFim: null
    };

    setSolicitacoes([...solicitacoes, novaSolicitacao]);
    setNome('');
    setSetor('');
    setOperacao('');
    setDescricao('');
    alert('Solicitação criada com sucesso!');
  };

  const aceitarSolicitacao = (id: number, nomeAlinhador: string) => {
    setSolicitacoes(solicitacoes.map(s => 
      s.id === id 
        ? { ...s, status: 'Em Andamento', alinhador: nomeAlinhador, horaInicio: new Date().toLocaleTimeString('pt-BR') }
        : s
    ));
  };

  const finalizarSolicitacao = (id: number, sucesso: boolean, obs: string = '') => {
    setSolicitacoes(solicitacoes.map(s => 
      s.id === id 
        ? { 
            ...s, 
            status: sucesso ? 'Finalizada' : 'Com Ofensor', 
            observacao: obs,
            horaFim: new Date().toLocaleTimeString('pt-BR')
          }
        : s
    ));
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Pendente') return '🕐';
    if (status === 'Em Andamento') return '▶️';
    if (status === 'Finalizada') return '✅';
    if (status === 'Com Ofensor') return '❌';
    return '⏳';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Pendente') return 'bg-gray-400';
    if (status === 'Em Andamento') return 'bg-blue-500';
    if (status === 'Finalizada') return 'bg-green-500';
    if (status === 'Com Ofensor') return 'bg-red-500';
    return 'bg-gray-400';
  };

  const adicionarSolicitante = () => {
    if (novoSolicitante.trim()) {
      setSolicitantes([...solicitantes, novoSolicitante.trim()]);
      setNovoSolicitante('');
    }
  };

  const adicionarAlinhador = () => {
    if (novoAlinhador.trim()) {
      const cores = ['bg-orange-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500'];
      const corIndex = alinhadores.length % cores.length;
      setAlinhadores([...alinhadores, novoAlinhador.trim()]);
      setCoresAlinhadores({...coresAlinhadores, [novoAlinhador.trim()]: cores[corIndex]});
      setNovoAlinhador('');
    }
  };

  const adicionarManobra = () => {
    if (novaManobra.trim()) {
      setTiposManobra([...tiposManobra, novaManobra.trim()]);
      setNovaManobra('');
    }
  };

  const removerItem = (tipo: string, index: number) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      if (tipo === 'solicitante') {
        setSolicitantes(solicitantes.filter((_, i) => i !== index));
      } else if (tipo === 'alinhador') {
        setAlinhadores(alinhadores.filter((_, i) => i !== index));
      } else if (tipo === 'manobra') {
        setTiposManobra(tiposManobra.filter((_, i) => i !== index));
      }
    }
  };

  const TelaSolicitante = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nova Solicitação de Alinhamento</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Solicitante *</label>
            <select
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione seu nome</option>
              {solicitantes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Setor *</label>
            <select
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o setor</option>
              {Object.keys(CORES_SETORES).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Operação *</label>
            <select
              value={operacao}
              onChange={(e) => setOperacao(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione a operação</option>
              {tiposManobra.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada *</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descreva com detalhes a operação necessária (tanque, válvulas específicas, etc.)"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Turno Atual:</strong> Turno {getTurnoAtual()} ({TURNOS[getTurnoAtual()]})
            </p>
          </div>

          <button
            onClick={criarSolicitacao}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Criar Solicitação
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Minhas Solicitações Pendentes</h3>
        <div className="space-y-3">
          {solicitacoes.filter(s => s.status === 'Pendente' || s.status === 'Em Andamento').length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma solicitação pendente</p>
          ) : (
            solicitacoes
              .filter(s => s.status === 'Pendente' || s.status === 'Em Andamento')
              .map(sol => (
                <div key={sol.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`${getStatusColor(sol.status)} text-white px-3 py-1 rounded-full text-sm flex items-center gap-2`}>
                        <span>{getStatusIcon(sol.status)}</span>
                        {sol.status}
                      </span>
                      <span className={`${CORES_SETORES[sol.setor]} text-white px-3 py-1 rounded text-sm`}>
                        {sol.setor}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{sol.horario}</span>
                  </div>
                  <p className="text-gray-700 mb-1"><strong>Operação:</strong> {sol.operacao}</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Descrição:</strong> {sol.descricao}</p>
                  {sol.alinhador && (
                    <p className="text-sm text-gray-600"><strong>Alinhador:</strong> {sol.alinhador}</p>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );

  const TelaAlinhador = () => {
    const [alinhadorSelecionado, setAlinhadorSelecionado] = useState('');

    const aceitarComAlinhador = (id) => {
      if (!alinhadorSelecionado) {
        alert('Selecione um alinhador primeiro!');
        return;
      }
      aceitarSolicitacao(id, alinhadorSelecionado);
    };

    const finalizarComStatus = (id, sucesso) => {
      const obs = sucesso ? '' : prompt('Descreva o motivo que impediu a realização da manobra:');
      if (!sucesso && !obs) {
        alert('É necessário informar o motivo do ofensor!');
        return;
      }
      finalizarSolicitacao(id, sucesso, obs);
      alert(sucesso ? 'Alinhamento finalizado com sucesso!' : 'Alinhamento encerrado devido a ofensor.');
    };

    const pendentes = solicitacoes.filter(s => s.status === 'Pendente');
    const emAndamento = solicitacoes.filter(s => s.status === 'Em Andamento');

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Painel do Alinhador</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Selecione seu nome</label>
            <select
              value={alinhadorSelecionado}
              onChange={(e) => setAlinhadorSelecionado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Escolha o alinhador</option>
              {alinhadores.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🕐</span>
                Solicitações Pendentes ({pendentes.length})
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {pendentes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma solicitação pendente</p>
                ) : (
                  pendentes.map(sol => (
                    <div key={sol.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${CORES_SETORES[sol.setor]} text-white px-3 py-1 rounded text-sm`}>
                          {sol.setor}
                        </span>
                        <span className="text-sm text-gray-600">{sol.horario}</span>
                      </div>
                      <p className="text-sm mb-1"><strong>Solicitante:</strong> {sol.nome}</p>
                      <p className="text-sm mb-1"><strong>Operação:</strong> {sol.operacao}</p>
                      <p className="text-xs text-gray-600 mb-2 bg-white p-2 rounded"><strong>Descrição:</strong> {sol.descricao}</p>
                      <button
                        onClick={() => aceitarComAlinhador(sol.id)}
                        className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        Aceitar Alinhamento
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>▶️</span>
                Em Andamento ({emAndamento.length})
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {emAndamento.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum alinhamento em andamento</p>
                ) : (
                  emAndamento.map(sol => (
                    <div key={sol.id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${CORES_SETORES[sol.setor]} text-white px-3 py-1 rounded text-sm`}>
                          {sol.setor}
                        </span>
                        <span className={`${coresAlinhadores[sol.alinhador]} text-white px-2 py-1 rounded text-xs`}>
                          {sol.alinhador}
                        </span>
                      </div>
                      <p className="text-sm mb-1"><strong>Solicitante:</strong> {sol.nome}</p>
                      <p className="text-sm mb-1"><strong>Operação:</strong> {sol.operacao}</p>
                      <p className="text-xs text-gray-600 mb-2 bg-white p-2 rounded"><strong>Descrição:</strong> {sol.descricao}</p>
                      <p className="text-xs text-gray-600 mb-3">Início: {sol.horaInicio}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => finalizarComStatus(sol.id, true)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                        >
                          ✓ Finalizar
                        </button>
                        <button
                          onClick={() => finalizarComStatus(sol.id, false)}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                        >
                          ✕ Ofensor
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TelaHistorico = () => {
    const solicitacoesFiltradas = solicitacoes.filter(s => {
      const filtraSetor = filtroSetor === 'Todos' || s.setor === filtroSetor;
      const filtraStatus = filtroStatus === 'Todos' || s.status === filtroStatus;
      return filtraSetor && filtraStatus;
    });

    const stats = {
      total: solicitacoes.length,
      pendentes: solicitacoes.filter(s => s.status === 'Pendente').length,
      emAndamento: solicitacoes.filter(s => s.status === 'Em Andamento').length,
      finalizadas: solicitacoes.filter(s => s.status === 'Finalizada').length,
      ofensores: solicitacoes.filter(s => s.status === 'Com Ofensor').length
    };

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pendentes</p>
            <p className="text-2xl font-bold text-gray-400">{stats.pendentes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Em Andamento</p>
            <p className="text-2xl font-bold text-blue-500">{stats.emAndamento}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Finalizadas</p>
            <p className="text-2xl font-bold text-green-500">{stats.finalizadas}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Ofensores</p>
            <p className="text-2xl font-bold text-red-500">{stats.ofensores}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Setor</label>
              <select
                value={filtroSetor}
                onChange={(e) => setFiltroSetor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Todos">Todos os Setores</option>
                {Object.keys(CORES_SETORES).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Com Ofensor">Com Ofensor</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data/Hora</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Solicitante</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Setor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Operação</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Alinhador</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Motivo Ofensor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {solicitacoesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Nenhuma solicitação encontrada
                    </td>
                  </tr>
                ) : (
                  solicitacoesFiltradas.map(sol => (
                    <tr key={sol.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        {sol.data}<br/>{sol.horario}
                      </td>
                      <td className="px-4 py-3 text-sm">{sol.nome}</td>
                      <td className="px-4 py-3">
                        <span className={`${CORES_SETORES[sol.setor]} text-white px-2 py-1 rounded text-xs`}>
                          {sol.setor}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{sol.operacao}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                        {sol.descricao}
                      </td>
                      <td className="px-4 py-3">
                        {sol.alinhador ? (
                          <span className={`${coresAlinhadores[sol.alinhador]} text-white px-2 py-1 rounded text-xs`}>
                            {sol.alinhador}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${getStatusColor(sol.status)} text-white px-2 py-1 rounded text-xs flex items-center gap-1 w-fit`}>
                          <span>{getStatusIcon(sol.status)}</span>
                          {sol.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {sol.observacao ? (
                          <span className="text-sm text-red-600 font-semibold">{sol.observacao}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {sol.horaInicio && sol.horaFim && (
                          <span className="text-xs text-gray-600">
                            {sol.horaInicio} - {sol.horaFim}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const InputEditavel = ({ valor, onSalvar, onCancelar }) => {
    const [valorLocal, setValorLocal] = React.useState(valor);

    const handleSalvar = () => {
      if (valorLocal.trim()) {
        onSalvar(valorLocal.trim());
      }
    };

    return (
      <div className="flex items-center gap-2 flex-1">
        <input
          type="text"
          defaultValue={valor}
          onChange={(e) => setValorLocal(e.target.value)}
          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSalvar();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              onCancelar();
            }
          }}
          autoFocus
        />
        <button
          onClick={handleSalvar}
          className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 whitespace-nowrap"
        >
          Salvar
        </button>
        <button
          onClick={onCancelar}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
        >
          ✕
        </button>
      </div>
    );
  };

  const iniciarEdicao = (tipo: string, index: number, valor: string) => {
    setEditandoItem({ tipo, index, valor });
    setInputEmEdicao(valor);
  };

  const cancelarEdicao = () => {
    setEditandoItem({ tipo: null, index: null, valor: '' });
    setInputEmEdicao('');
  };

  const salvarEdicaoItem = (novoValor: string, tipo: string, index: number) => {
    if (tipo === 'solicitante') {
      const novos = [...solicitantes];
      novos[index] = novoValor;
      setSolicitantes(novos);
    } else if (tipo === 'alinhador') {
      const novos = [...alinhadores];
      const antigoNome = novos[index];
      novos[index] = novoValor;
      setAlinhadores(novos);
      
      const novaCor = coresAlinhadores[antigoNome] || 'bg-gray-500';
      const novasCores = {...coresAlinhadores};
      delete novasCores[antigoNome];
      novasCores[novoValor] = novaCor;
      setCoresAlinhadores(novasCores);
    } else if (tipo === 'manobra') {
      const novos = [...tiposManobra];
      novos[index] = novoValor;
      setTiposManobra(novos);
    }
    cancelarEdicao();
  };

  const TelaConfiguracoes = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>⚙️</span>
          Configurações do Sistema
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Gerenciar Solicitantes</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={novoSolicitante}
                onChange={(e) => setNovoSolicitante(e.target.value)}
                placeholder="Nome do solicitante"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarSolicitante();
                  }
                }}
              />
              <button
                onClick={adicionarSolicitante}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <span>➕</span> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {solicitantes.map((sol, index) => (
                <div key={`sol-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  {editandoItem.tipo === 'solicitante' && editandoItem.index === index ? (
                    <InputEditavel
                      valor={sol}
                      onSalvar={(novoValor) => salvarEdicaoItem(novoValor, 'solicitante', index)}
                      onCancelar={cancelarEdicao}
                    />
                  ) : (
                    <>
                      <span className="text-gray-800">{sol}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => iniciarEdicao('solicitante', index, sol)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <span>✏️</span>
                        </button>
                        <button
                          onClick={() => removerItem('solicitante', index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Gerenciar Alinhadores</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={novoAlinhador}
                onChange={(e) => setNovoAlinhador(e.target.value)}
                placeholder="Nome do alinhador"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarAlinhador();
                  }
                }}
              />
              <button
                onClick={adicionarAlinhador}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <span>➕</span> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {alinhadores.map((alin, index) => (
                <div key={`alin-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  {editandoItem.tipo === 'alinhador' && editandoItem.index === index ? (
                    <InputEditavel
                      valor={alin}
                      onSalvar={(novoValor) => salvarEdicaoItem(novoValor, 'alinhador', index)}
                      onCancelar={cancelarEdicao}
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className={`${coresAlinhadores[alin]} text-white px-3 py-1 rounded text-sm`}>
                          {alin}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => iniciarEdicao('alinhador', index, alin)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <span>✏️</span>
                        </button>
                        <button
                          onClick={() => removerItem('alinhador', index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Gerenciar Tipos de Manobra</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={novaManobra}
                onChange={(e) => setNovaManobra(e.target.value)}
                placeholder="Tipo de manobra"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarManobra();
                  }
                }}
              />
              <button
                onClick={adicionarManobra}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <span>➕</span> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {tiposManobra.map((man, index) => (
                <div key={`man-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  {editandoItem.tipo === 'manobra' && editandoItem.index === index ? (
                    <InputEditavel
                      valor={man}
                      onSalvar={(novoValor) => salvarEdicaoItem(novoValor, 'manobra', index)}
                      onCancelar={cancelarEdicao}
                    />
                  ) : (
                    <>
                      <span className="text-gray-800">{man}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => iniciarEdicao('manobra', index, man)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <span>✏️</span>
                        </button>
                        <button
                          onClick={() => removerItem('manobra', index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sistema de Alinhamento - Vibra Energia</h1>
          <nav className="flex flex-wrap gap-2">
            <button
              onClick={() => setTela('solicitante')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                tela === 'solicitante' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Solicitante
            </button>
            <button
              onClick={() => setTela('alinhador')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                tela === 'alinhador' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Alinhador
            </button>
            <button
              onClick={() => setTela('historico')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                tela === 'historico' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => setTela('config')}
              className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                tela === 'config' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span>⚙️</span>
              Configurações
            </button>
          </nav>
        </header>

        <main>
          {tela === 'solicitante' && <TelaSolicitante />}
          {tela === 'alinhador' && <TelaAlinhador />}
          {tela === 'historico' && <TelaHistorico />}
          {tela === 'config' && <TelaConfiguracoes />}
        </main>
      </div>
    </div>
  );
}
