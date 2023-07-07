import React, {useContext, useState} from "react";
import {GestaoDeUsuariosContext} from "./context/GestaoDeUsuariosProvider";

export const FormFiltros = ({grupos}) => {
    const {setFilter, initialFilter} = useContext(GestaoDeUsuariosContext);
    const [formFilter, setFormFilter] = useState(initialFilter);

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFormFilter = async (event) => {
        event.preventDefault();
        setFilter(formFilter);
    };

    const clearFilter = () => {
      setFormFilter(initialFilter);
      setFilter(initialFilter);
  };

    return (
        <form onSubmit={handleSubmitFormFilter} method="post">
            <div className="row mt-3">
                <div className="col">
                    <label htmlFor="filtrar_por_termo">Filtrar por nome ou id de usuário</label>
                    <input
                        value={formFilter.search}
                        onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                        name='search'
                        type="text"
                        className="form-control"
                        placeholder="Escreva o nome ou id"
                    />
                </div>
                <div className="col">
                    <label htmlFor="filtrar_por_grupo">Filtrar por grupo</label>
                    <select
                        value={formFilter.grupo}
                        onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                        name='grupo'
                        id='filtrar_por_grupo'
                        className='form-control'
                    >
                        <option key='' value="">Selecione um grupo</option>
                        {grupos && grupos.length > 0 && grupos.map((grupo, index) => (
                            <option key={index} value={grupo.id}>{grupo.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col">
                    <label htmlFor="filtrar_por_grupo">Filtrar por tipo de usuário</label>
                    <select
                        value={formFilter.tipoUsuario}
                        onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                        name='tipoUsuario'
                        id='filtrar_tipo_de_usuario'
                        className='form-control'
                    >
                        <option value="">Selecione um tipo</option>
                        <option value="servidor">Servidor</option>
                        <option value="nao-servidor">Não Servidor</option>
                    </select>
                </div>
            </div>
            <div className={"barra-botoes-filtro d-flex justify-content-end mt-n2"}>
                <button onClick={() => clearFilter()} type="reset"
                        className="btn btn btn-outline-success mt-2 mr-2">Limpar
                </button>
                <button type="submit" className="btn btn-success mt-2">Filtrar</button>
            </div>
        </form>
    );
};