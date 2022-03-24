package com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge;


import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Include;
import org.eclipse.uml2.uml.UMLFactory;
import org.eclipse.uml2.uml.UseCase;

public class AddIncludeCommand extends UmlSemanticElementCommand {

    private final Include newInclude;
    protected final UseCase sourceUseCase;
    protected final UseCase targetUseCase;

    public AddIncludeCommand(final EditingDomain domain, final URI modelUri, final String sourceUseCaseUriFragment,
                             final String targetUseCaseUriFragment) {
        super(domain, modelUri);
        this.newInclude = UMLFactory.eINSTANCE.createInclude();
        this.sourceUseCase = UmlSemanticCommandUtil.getElement(umlModel, sourceUseCaseUriFragment, UseCase.class);
        this.targetUseCase = UmlSemanticCommandUtil.getElement(umlModel, targetUseCaseUriFragment, UseCase.class);
    }

    @Override
    protected void doExecute() {
        getNewInclude().setIncludingCase(sourceUseCase);
        getNewInclude().setAddition(targetUseCase);
    }

    public Include getNewInclude() {return newInclude;}

}
