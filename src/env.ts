import LanguageManager from './language';


export const NON_THEOREM_LIKE_ENV_IDs = [
    "proof", 
    "solution",
] as const;


export const THEOREM_LIKE_ENV_IDs = [
    "axiom", 
    "definition",
    "lemma", 
    "proposition", 
    "theorem",
    "corollary",
    "claim", 
    "assumption",
    "example",
    "exercise",
    "conjecture",
    "hypothesis",
    "remark",
] as const;

export const ENV_IDs = [...THEOREM_LIKE_ENV_IDs, ...NON_THEOREM_LIKE_ENV_IDs, ] as const;

export type ENV_ID = typeof ENV_IDs[number];
export type THEOREM_LIKE_ENV_ID = typeof THEOREM_LIKE_ENV_IDs[number];

export class Env {
    public printedNames: Record<string, string>;

    constructor(
        public id: ENV_ID,
        printedNames: Record<string, string>
    ) {
        this.printedNames = {};
        this.name(printedNames);
    };

    name(langNamePairs: Record<string, string>) {
        for (const lang in langNamePairs) {
            LanguageManager.assert(lang);
            this.printedNames[lang] = langNamePairs[lang];
        }
    }
}

export const PROOF = new Env('proof', { ja: '証明', en: 'Proof' });
export const SOLUTION = new Env('solution', { ja: '解答', en: 'Solution' });


export class TheoremLikeEnv extends Env {
    constructor(
        public id: THEOREM_LIKE_ENV_ID,
        public printedNames: Record<string, string>,
        public prefix: string,
        public proofEnv?: Env
    ) {
        super(id, printedNames);
    }

    match(key: string): boolean {
        key = key.toLowerCase();
        for (const prop of [this.id, this.prefix]) {
            if (key == prop.toLowerCase()) {
                return true;
            }
        }
        for (const lang in this.printedNames) {
            const name = this.printedNames[lang].toLowerCase();
            if (key == name) {
                return true;
            }
        }
        return false;
    }
}




export const ENVs = [
    // Note axiom is not supported by Bookdownw
    new TheoremLikeEnv(
        "axiom",
        { ja: "公理", en: "Axiom" },
        "axm",
    ),
    new TheoremLikeEnv(
        "definition",
        { ja: "定義", en: "Definition" },
        "def",
    ),
    new TheoremLikeEnv(
        "lemma",
        { ja: "補題", en: "Lemma" },
        "lem",
        PROOF,
    ),
    new TheoremLikeEnv(
        "proposition",
        { ja: "命題", en: "Proposition" },
        "prop",
        PROOF,
    ),
    new TheoremLikeEnv(
        "theorem",
        { ja: "定理", en: "Theorem" },
        "thm",
        PROOF,
    ),
    new TheoremLikeEnv(
        "corollary",
        { ja: "系", en: "Corollary" },
        "cor",
        PROOF,
    ),
    // Note claim is not supported by Bookdownw
    new TheoremLikeEnv(
        "claim",
        { ja: "主張", en: "Claim" },
        "clm",
        PROOF,
    ),
    // Note that assumption is not supported by Bookdownw
    new TheoremLikeEnv(
        "assumption",
        { ja: "仮定", en: "Assumption" },
        "ass",
    ),
    new TheoremLikeEnv(
        "example",
        { ja: "例", en: "Example" },
        "exm",
        PROOF,
    ),
    new TheoremLikeEnv(
        "exercise",
        { ja: "演習問題", en: "Exercise" },
        "exr",
        SOLUTION,
    ),
    new TheoremLikeEnv(
        "conjecture",
        { ja: "予想", en: "Conjecture" },
        "cnj",
    ),
    new TheoremLikeEnv(
        "hypothesis",
        { ja: "仮説", en: "Hypothesis" },
        "hyp",
    ),
    new TheoremLikeEnv(
        "remark",
        { ja: "注", en: "Remark" },
        "rmk",
    ),
]


export const ENVs_MAP = Object.fromEntries(
    ENVs.map((env) => [env.id, env])
);



export function getTheoremLikeEnv(key: string): TheoremLikeEnv {
    const result = ENVs.find((env) => env.match(key));
    // for (const env of ENVs) {
    //     if (env.match(key)) {
    //         return env;
    //     }
    // }
    if (result) {
        return result;
    }
    throw Error(`Invalid theorem.type = ${key}`);
}
