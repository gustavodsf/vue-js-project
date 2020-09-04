export default {
  "404": {
    button: {
      backToHome: "ir para a página inicial"
    },
    pageNotFound: "ops... esta página não foi encontrada"
  },
  archetype: {
    view: {
      form: {
        label: {
          description: "que tal uma descrição bem legal sobre ele?",
          isRequired: "ele é obrigatório ou opcional?",
          name: "qual o nome do arquétipo?",
          optional: "opcional",
          required: "obrigatório"
        }
      }
    }
  },
  default: {
    confirm: {
      delete: {
        title: "excluir {0}",
        message: "Tem certeza de que deseja executar essa ação?",
        confirmText: "excluir {0}",
        cancelText: "cancelar"
      }
    },
    label: {
      add: "adicionar {0}",
      archetype: "arquétipo | arquétipos",
      backward: "voltar",
      character: "personagem | personagens",
      close: "fechar",
      context: "contexto | contextos",
      delete: "excluir {0}",
      description: "descrição | descrições",
      edit: "editar {0}",
      event: "evento | eventos",
      forward: "avançar",
      keyPhrase: "palavra-chave | palavras-chave",
      no: {
        data:
          "ops, ainda não existe {0} no sistema | ops, ainda não existem {0} no sistema",
        result: "ops, nenhum resultado encontrado"
      },
      number: "número | números",
      objective: "objetivo | objetivos",
      optional: "opcional",
      required: "obrigatório",
      stage: "estágio | estágios",
      story: "história | histórias",
      tell: "contar {0}"
    },
    message: {
      delete: "{0} excluído com sucesso| {0} excluídos com sucesso"
    }
  },
  error: {
    email: {
      is: {
        invalid: "ops, parece que esse não é um e-mail válido!"
      }
    },
    field: {
      is: {
        required: "ops, você precisa preencher este campo!"
      }
    },
    minValue: "ops, o valor deste campo precisa ser maior do que {0}",
    password: {
      minLength: "ops, sua senha precisa ter no mínimo {minLength} caracteres"
    }
  },
  home: {
    view: {
      home: {
        button: {
          letsStart: "Vamos começar?"
        },
        features: {
          shareKnowledge: {
            title: "Compartilhe conhecimento!",
            description:
              "Conte para seus colegas, de forma criativa, sobre os projetos e outras atividades em grupo, das quais você tenha participado em sua organização."
          },
          tellUsStory: {
            title: "Conte-nos uma história!",
            description:
              "Através de um método dinâmico e colaborativo, você pode criar uma história, com seus personagens, que conte sobre experiências vivenciadas, pontos positivos e negativos e outros aspectos importantes."
          },
          inviteOthersToCollaborate: {
            title: "Convide outras pessoas para colaborarem!",
            description:
              "Convide seus colegas para participarem da construção da sua narrativa."
          },
          bestResultsInYourOrganization: {
            title: "Melhores resultados em sua organização!",
            description:
              "Através do compartilhamento de ideias e lições aprendidas, é possível estabelecer pontos de melhorias em processos de trabalho e buscar métodos que otimizem e aumentem a produtividade em sua organização."
          }
        },
        subtitle:
          "TellYou é uma ferramenta que permite o compartilhamento de lições aprendidas, sobre atividades em grupo, de forma dinâmica e colaborativa.",
        title: "Esta é uma nova forma de compartilhar experiências!"
      },
      singIn: {
        button: {
          singIn: "entrar",
          forgetPassword: "esqueci a senha!",
          reset: "trocar senha!"
        },
        label: {
          email: "use seu e-mail para entrar",
          password: "e a sua senha super secreta",
          emailStored: "informe o e-mail utilizado no cadastro"
        },
        title: "Que bom que está de volta!"
      },
      singUp: {
        button: {
          singUp: "envie minhas informações"
        },
        label: {
          email: "qual seu e-mail para contato?",
          name: "como podemos te chamar?",
          password: "Agora, aquela senha para proteger a conta ;)"
        },
        title: "É um imenso prazer tê-lo aqui! ",
        subtitle: "Conte pra gente sobre você, queremos te conhecer... "
      }
    }
  },
  navbar: {
    button: {
      singUp: "Cadastrar-se",
      singIn: "Entrar"
    },
    singOut: "Sair"
  },
  stage: {
    view: {
      form: {
        label: {
          archetypes: "quais arquétipos fazem parte deste estágio?",
          contexts: "este estágio poderia estar inserido em quais contextos?",
          description: "que tal uma descrição bem legal sobre ele?",
          isRequired: "ele é obrigatório ou opcional?",
          keyPhrases: "crie frases-chaves para ajudar na criação dos eventos.",
          name: "qual é o nome do estágio?"
        }
      }
    }
  },
  story: {
    view: {
      form: {
        label: {
          authors:
            "os contadores irão narrar cada evento que irá compor a história. ",
          keywords:
            "palavras-chaves ajudam outras pessoas a encontrarem sua história",
          leader:
            "o líder irá conduzir o desenvolvimento da narrativa, organizar a história e estimular a participação do grupo.",
          objective: "qual o objetivo da história?",
          reviewers:
            "os revisores irão editar a história, formatando e aprimorando o texto, até a sua finalização.",
          title: "qual o título da história?"
        },
        message: {
          keywords: "a cada palavra-chave digitada, pressione enter"
        },
        step: {
          archetype: "arquétipos",
          author: "autores",
          info: "informações básicas",
          stage: "estágios"
        }
      }
    }
  }
};
