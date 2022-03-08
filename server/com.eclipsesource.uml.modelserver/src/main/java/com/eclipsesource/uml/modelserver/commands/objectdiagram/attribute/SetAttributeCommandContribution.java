package com.eclipsesource.uml.modelserver.commands.objectdiagram.attribute;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.uml2.uml.Type;

public class SetAttributeCommandContribution extends UmlSemanticCommandContribution {

    public static final String TYPE = "setAttribute";
    public static final String NEW_NAME = "newName";
    public static final String NEW_TYPE = "newType";
    public static final String NEW_BOUNDS = "newBounds";

    public static CCommand create(final String semanticUri, final String newName, final String newType,
                                  final String newBounds) {
        CCommand setAttributeCommand = CCommandFactory.eINSTANCE.createCommand();
        setAttributeCommand.setType(TYPE);
        setAttributeCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        setAttributeCommand.getProperties().put(NEW_NAME, newName);
        setAttributeCommand.getProperties().put(NEW_TYPE, newType);
        setAttributeCommand.getProperties().put(NEW_BOUNDS, newBounds);
        return setAttributeCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        String newName = command.getProperties().get(NEW_NAME);
        Type newType = UmlSemanticCommandUtil.getType(domain, command.getProperties().get(NEW_TYPE));
        int newLowerBound = UmlSemanticCommandUtil.getLower(command.getProperties().get(NEW_BOUNDS));
        int newUpperBound = UmlSemanticCommandUtil.getUpper(command.getProperties().get(NEW_BOUNDS));

        return new SetAttributeCommand(domain, modelUri, semanticUriFragment, newName, newType, newLowerBound,
                newUpperBound);
    }
}
