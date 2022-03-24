package com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.UMLFactory;

public class AddFinalStateCommand extends UmlSemanticElementCommand {

    protected final FinalState newFinalState;
    protected final Region containerRegion;

    public AddFinalStateCommand(final EditingDomain domain, final URI modelUri, final String containerRegionUriFragment) {
        super(domain, modelUri);
        this.newFinalState = UMLFactory.eINSTANCE.createFinalState();
        this.containerRegion = UmlSemanticCommandUtil.getElement(umlModel, containerRegionUriFragment, Region.class);
    }

    @Override
    protected void doExecute() {
        newFinalState.setName(UmlSemanticCommandUtil.getNewFinalStateName(containerRegion));
        containerRegion.getSubvertices().add(newFinalState);
    }

    public FinalState getNewFinalState() {
        return newFinalState;
    }
}
