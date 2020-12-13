export class PagseguroDado{

    public id:number;
    public user_id:number;
    public paymentMethod:string;
    public tipo:string;
	public cpf:string;
    public nome:string;
	public sexo:string;
    public telefone:string;
	public celular:string;
    public email:string;
    public nascimento:string;
    public logradouro:string;
    public complemento:string;
    public numero:string;
    public bairro:string;
    public cep:string;
    public cidade:string;
    public estado:string;
    public vigencia:number;
    public numCard:string;              //ex: '4111111111111111' 
    public nomCard:string;               
    public mesValidadeCard:string;      // ex: '12';
    public anoValidadeCard:string;      // ex: '2030';
    public codSegCard:string;           // ex: '123';
	public birthdate:string;
	public phone:string;
	public cpfCard:string;
	
    public hashComprador:string;        // preenchido dinamicamente
    public bandCard:string;             // preenchido dinamicamente
    public hashCard:string;             // preenchido dinamicamente
    public parcela:any;              // 
    public parcelas:Array<Object> = []; // preenchido dinamicamente
	public produtos:Array<Object> = []; // preenchido dinamicamente

    constructor(obj?) {
        
        Object.assign(this, obj, {}, {});
    }
}

