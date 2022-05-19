package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;

public class AddPackageCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addPackageContribution";
   public static final String PARENT_SEMANTIC_PROXY_URI = "semanticProxyUri";

   public static CCompoundCommand create(final String parentSemanticUri, final GPoint position) {
      CCompoundCommand addPackageCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addPackageCommand.setType(TYPE);
      addPackageCommand.getProperties().put(PARENT_SEMANTIC_PROXY_URI, parentSemanticUri);
      addPackageCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X, String.valueOf(position.getX()));
      addPackageCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y, String.valueOf(position.getY()));
      return addPackageCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_PROXY_URI);
      GPoint packagePosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
            command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      return new AddPackageCompoundCommand(domain, modelUri, packagePosition, parentSemanticUri);
   }
}
