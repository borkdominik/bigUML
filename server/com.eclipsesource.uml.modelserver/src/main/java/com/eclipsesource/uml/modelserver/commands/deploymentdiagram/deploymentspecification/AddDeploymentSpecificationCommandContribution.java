package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentspecification;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;

public class AddDeploymentSpecificationCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "addDeploymentSpecificationContributuion";

    public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
        CCompoundCommand addDeploymentSpecificationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addDeploymentSpecificationCommand.setType(TYPE);
        addDeploymentSpecificationCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
                String.valueOf(position.getX()));
        addDeploymentSpecificationCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
                String.valueOf(position.getY()));
        addDeploymentSpecificationCommand.getProperties().put(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT,
                parentSemanticUri);
        return addDeploymentSpecificationCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        GPoint deploymentSpecificationPosition = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

        String parentSemanticUriFragment = command.getProperties()
                .get(UmlSemanticCommandContribution.PARENT_SEMANTIC_URI_FRAGMENT);

        return new AddDeploymentSpecificationCompoundCommand(domain, modelUri, deploymentSpecificationPosition,
                parentSemanticUriFragment);
    }

}