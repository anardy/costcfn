const YAML = require('yaml-cfn');
const fs = require('fs')

let template = fs.readFileSync('teste.yml');

let paramFile = fs.readFileSync('param.json');
let params = JSON.parse(paramFile);

const parse = YAML.yamlParse(template)

const billable = ['ContainerInstances', 'ECSAutoScalingGroup']

const resources = [...Object.keys(parse.Resources)].sort();

let rscBillables = resources.filter(el => billable.indexOf(el) !== -1);

let ECS = {};

rscBillables.forEach(el => {
    if (el === 'ContainerInstances') {       
        let typeInstance = parse.Resources.ContainerInstances.Properties.InstanceType.Ref
        ECS.instance = params[typeInstance];
    } else if (el === 'ECSAutoScalingGroup') {
        let desired = parse.Resources.ECSAutoScalingGroup.Properties.DesiredCapacity.Ref
        ECS.desired = params[desired];
    }
})
console.log(ECS)
console.log('Analisando o Custo do Cluster ECS');
console.log(`Custo mensal: US$ ${parseInt(ECS.desired,10)*730*0.0186}`);