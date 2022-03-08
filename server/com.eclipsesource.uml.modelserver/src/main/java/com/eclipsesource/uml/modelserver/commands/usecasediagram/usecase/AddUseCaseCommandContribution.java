package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;

import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlPositioningAndSizingUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;

public class AddUseCaseCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "addUseCaseContribution";

    public static CCompoundCommand create(final GPoint position) {
        CCompoundCommand addUseCaseCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addUseCaseCommand.setType(TYPE);
        addUseCaseCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
        addUseCaseCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
        return addUseCaseCommand;
    }

    public static CCompoundCommand create(final GPoint position, final String parentSemanticUri) {
        CCompoundCommand addUseCaseCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addUseCaseCommand.setType(TYPE);
        addUseCaseCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
        addUseCaseCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
        addUseCaseCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
        return addUseCaseCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        if (command.getProperties().containsKey(PARENT_SEMANTIC_URI_FRAGMENT)) {
            String parentUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
            GPoint p = ((Shape) UmlNotationCommandUtil.getNotationElement(modelUri, domain, parentUri)).getPosition();
            GPoint useCasePosition = UmlNotationCommandUtil.getGPoint(
                    command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                    command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));
            useCasePosition = UmlPositioningAndSizingUtil.getRelativePosition(p, useCasePosition);

            return new AddUseCaseCompoundCommand(domain, modelUri, useCasePosition, parentUri);
        }

        GPoint usecasePosition = UmlNotationCommandUtil.getGPoint(
                command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
                command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));
        return new AddUseCaseCompoundCommand(domain, modelUri, usecasePosition);
    }

}
